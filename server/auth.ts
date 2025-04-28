import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, LoginData } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  // For admin user with plaintext password during transition to hashed passwords
  if (!stored.includes('.')) {
    return supplied === stored;
  }
  
  // For properly hashed passwords
  const [hashed, salt] = stored.split(".");
  if (!salt) {
    console.error("Invalid password format, missing salt");
    return false;
  }
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "movie-stream-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  // Log IP address for each request
  app.use((req: Request, res, next) => {
    if (req.isAuthenticated()) {
      const userId = req.user.id;
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
      
      // Only log for certain paths to avoid excessive logging
      if (req.path.startsWith('/api') && 
          !req.path.includes('activity') && 
          !req.path.includes('security')) {
        storage.logActivity({
          userId,
          ipAddress,
          activity: "request",
          movieId: null,
          details: { 
            path: req.path,
            method: req.method
          }
        });
      }
    }
    next();
  });

  // Authentication Routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      // Log the registration
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
      await storage.logActivity({
        userId: user.id,
        ipAddress,
        activity: "registration",
        movieId: null,
        details: { userAgent: req.headers['user-agent'] }
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send the password in the response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      
      req.login(user, async (err) => {
        if (err) return next(err);
        
        // Log the login
        const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
        await storage.logActivity({
          userId: user.id,
          ipAddress,
          activity: "login",
          movieId: null,
          details: { userAgent: req.headers['user-agent'] }
        });
        
        // Don't send the password in the response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", async (req, res, next) => {
    if (req.isAuthenticated()) {
      const userId = req.user.id;
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
      
      // Log the logout
      await storage.logActivity({
        userId,
        ipAddress,
        activity: "logout",
        movieId: null,
        details: { userAgent: req.headers['user-agent'] }
      });
    }
    
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Don't send the password in the response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Admin check middleware
  app.use("/api/admin", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    next();
  });
}
