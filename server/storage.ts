import { users, type User, type InsertUser, movies, type Movie, type InsertMovie, 
  activityLogs, type ActivityLog, type InsertActivityLog } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Movie methods
  getMovie(id: number): Promise<Movie | undefined>;
  getAllMovies(): Promise<Movie[]>;
  getMoviesByCategory(category: string): Promise<Movie[]>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: number, movie: Partial<InsertMovie>): Promise<Movie | undefined>;
  deleteMovie(id: number): Promise<boolean>;
  
  // Activity log methods
  logActivity(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(): Promise<ActivityLog[]>;
  getActivityLogsByUserId(userId: number): Promise<ActivityLog[]>;
  
  // Session store
  sessionStore: any; // Using any for session store type
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any for session store type

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    
    // Seed data can be added here in a real project
    // For this demo, we'll check and add data only if needed
    this.seedData();
  }

  private async seedData() {
    // Check if admin user exists
    const adminUser = await this.getUserByUsername("admin");
    if (!adminUser) {
      // Add default admin user
      await this.createUser({
        username: "admin",
        password: "admin123",
        email: "admin@example.com",
        isAdmin: true
      });
    }
    
    // Check if we have movies
    const existingMovies = await this.getAllMovies();
    if (existingMovies.length === 0) {
      // Add some demo movies
      const categories = ["Action", "Drama", "Sci-Fi", "Comedy", "Horror"];
      const movieTitles = [
        "The Dark Knight",
        "Inception",
        "Interstellar",
        "Parasite",
        "The Shawshank Redemption",
        "Mad Max: Fury Road",
        "John Wick",
        "Avengers: Endgame"
      ];
      
      for (let i = 0; i < movieTitles.length; i++) {
        await this.createMovie({
          title: movieTitles[i],
          description: "A captivating movie with an exciting storyline that will keep you on the edge of your seat.",
          thumbnailUrl: `https://source.unsplash.com/random/300x450?movie,cinema,${i}`,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Demo video URL
          year: 2010 + Math.floor(Math.random() * 13), // Random year between 2010-2023
          duration: 90 + Math.floor(Math.random() * 60), // Random duration between 90-150 minutes
          rating: ["PG", "PG-13", "R"][Math.floor(Math.random() * 3)], // Random rating
          score: 70 + Math.floor(Math.random() * 30), // Random score between 70-100
          category: categories[Math.floor(Math.random() * categories.length)]
        });
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async getAllUsers(): Promise<User[]> {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    try {
      const result = await db.update(users)
        .set(userData)
        .where(eq(users.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  // Movie methods
  async getMovie(id: number): Promise<Movie | undefined> {
    try {
      const result = await db.select().from(movies).where(eq(movies.id, id));
      return result[0];
    } catch (error) {
      console.error("Error getting movie by ID:", error);
      return undefined;
    }
  }

  async getAllMovies(): Promise<Movie[]> {
    try {
      return await db.select().from(movies);
    } catch (error) {
      console.error("Error getting all movies:", error);
      return [];
    }
  }

  async getMoviesByCategory(category: string): Promise<Movie[]> {
    try {
      return await db.select().from(movies).where(eq(movies.category, category));
    } catch (error) {
      console.error("Error getting movies by category:", error);
      return [];
    }
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    try {
      const result = await db.insert(movies).values(insertMovie).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  }

  async updateMovie(id: number, movieData: Partial<InsertMovie>): Promise<Movie | undefined> {
    try {
      // First check if the movie exists
      const movie = await this.getMovie(id);
      if (!movie) {
        return undefined;
      }
      
      // Update the movie
      const result = await db.update(movies)
        .set(movieData)
        .where(eq(movies.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error("Error updating movie:", error);
      return undefined;
    }
  }

  async deleteMovie(id: number): Promise<Movie | undefined> {
    try {
      // First get the movie details for logging
      const movie = await this.getMovie(id);
      if (!movie) {
        return undefined;
      }
      
      // Delete activity logs first
      await db.delete(activityLogs).where(eq(activityLogs.movieId, id));
      
      // Then delete the movie
      const result = await db.delete(movies).where(eq(movies.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error;
    }
  }

  // Activity log methods
  async logActivity(insertLog: InsertActivityLog): Promise<ActivityLog> {
    try {
      const result = await db.insert(activityLogs).values(insertLog).returning();
      return result[0];
    } catch (error) {
      console.error("Error logging activity:", error);
      throw error;
    }
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    try {
      return await db.select().from(activityLogs).orderBy(desc(activityLogs.timestamp));
    } catch (error) {
      console.error("Error getting activity logs:", error);
      return [];
    }
  }

  async getActivityLogsByUserId(userId: number): Promise<ActivityLog[]> {
    try {
      return await db.select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, userId))
        .orderBy(desc(activityLogs.timestamp));
    } catch (error) {
      console.error("Error getting activity logs by user ID:", error);
      return [];
    }
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();
