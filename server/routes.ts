import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema, insertActivityLogSchema } from "@shared/schema";
import { hashPassword } from "./auth";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Create a unique filename: timestamp-originalname
      const uniqueFilename = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueFilename);
    }
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: function (req, file, cb) {
    // Accept video and image files
    const filetypes = /mp4|mov|avi|mkv|webm|jpg|jpeg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype || extname) {
      return cb(null, true);
    }
    cb(new Error("Only video and image files are allowed"));
  }
});

// Function to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Function to check if user is an admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Movies API
  app.get('/api/movies', async (req, res) => {
    try {
      const movies = await storage.getAllMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });
  
  app.get('/api/movies/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const movies = await storage.getMoviesByCategory(category);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movies by category" });
    }
  });
  
  app.get('/api/movies/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      
      const movie = await storage.getMovie(id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      
      // Log the view activity if user is authenticated
      if (req.isAuthenticated()) {
        const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
        await storage.logActivity({
          userId: req.user.id,
          ipAddress,
          activity: "view",
          movieId: id,
          details: { title: movie.title }
        });
      }
      
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });
  
  // Admin API routes
  app.post('/api/admin/movies', isAdmin, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Validation fails if no files are uploaded
      if (!files || !files.thumbnail || !files.video) {
        return res.status(400).json({ message: "Both thumbnail and video files are required" });
      }
      
      const thumbnailUrl = `/uploads/${files.thumbnail[0].filename}`;
      const videoUrl = `/uploads/${files.video[0].filename}`;
      
      const movieData = {
        ...req.body,
        thumbnailUrl,
        videoUrl,
        year: parseInt(req.body.year),
        duration: parseInt(req.body.duration),
        score: parseInt(req.body.score)
      };
      
      // Validate movie data
      const result = insertMovieSchema.safeParse(movieData);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid movie data", 
          errors: fromZodError(result.error).message 
        });
      }
      
      const movie = await storage.createMovie(result.data);
      
      // Log the activity
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
      await storage.logActivity({
        userId: req.user.id,
        ipAddress,
        activity: "create_movie",
        movieId: movie.id,
        details: { title: movie.title }
      });
      
      res.status(201).json(movie);
    } catch (error) {
      res.status(500).json({ message: "Failed to create movie" });
    }
  });
  
  app.put('/api/admin/movies/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      
      const movie = await storage.getMovie(id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      
      // Parse numeric fields
      const movieData = {
        ...req.body,
        ...(req.body.year && { year: parseInt(req.body.year) }),
        ...(req.body.duration && { duration: parseInt(req.body.duration) }),
        ...(req.body.score && { score: parseInt(req.body.score) })
      };
      
      const updatedMovie = await storage.updateMovie(id, movieData);
      
      // Log the activity
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
      await storage.logActivity({
        userId: req.user.id,
        ipAddress,
        activity: "update_movie",
        movieId: id,
        details: { title: movie.title }
      });
      
      res.json(updatedMovie);
    } catch (error) {
      res.status(500).json({ message: "Failed to update movie" });
    }
  });
  
  app.delete('/api/admin/movies/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      
      const deletedMovie = await storage.deleteMovie(id);
      if (!deletedMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Log the activity without movie reference since it's deleted
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
      await storage.logActivity({
        userId: req.user.id,
        ipAddress,
        activity: "delete_movie",
        details: { title: deletedMovie.title }
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error in delete movie route:", error);
      res.status(500).json({ message: "Failed to delete movie" });
    }
  });
  
  // Admin Security & Analytics API
  app.get('/api/admin/activity', isAdmin, async (req, res) => {
    try {
      const logs = await storage.getActivityLogs();
      
      // Enrich logs with user and movie data
      const enrichedLogs = await Promise.all(logs.map(async (log) => {
        const user = log.userId ? await storage.getUser(log.userId) : null;
        const movie = log.movieId ? await storage.getMovie(log.movieId) : null;
        
        return {
          ...log,
          user: user ? { 
            id: user.id, 
            username: user.username, 
            email: user.email,
            isAdmin: user.isAdmin 
          } : null,
          movie: movie ? {
            id: movie.id,
            title: movie.title
          } : null
        };
      }));
      
      res.json(enrichedLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });
  
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove password field from response
      const safeUsers = users.map(({ password, ...user }) => user);
      
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Update user endpoint
  app.put('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { username, email, isAdmin } = req.body;
      
      const user = await storage.updateUser(id, { username, email, isAdmin });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.post('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const { username, email, password, isAdmin } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create new user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        isAdmin: Boolean(isAdmin)
      });

      // Log the activity
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
      await storage.logActivity({
        userId: req.user.id,
        ipAddress,
        activity: "create_user",
        details: { createdUsername: username }
      });

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
