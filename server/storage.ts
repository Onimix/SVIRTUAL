import {
  users,
  matches,
  predictions,
  userSubscriptions,
  modelPerformance,
  platformStatus,
  activityLogs,
  type User,
  type UpsertUser,
  type Match,
  type InsertMatch,
  type Prediction,
  type InsertPrediction,
  type UserSubscription,
  type InsertUserSubscription,
  type ModelPerformance,
  type InsertModelPerformance,
  type PlatformStatus,
  type InsertPlatformStatus,
  type ActivityLog,
  type InsertActivityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Match operations
  getMatches(limit?: number): Promise<Match[]>;
  getUpcomingMatches(limit?: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatchResult(matchId: number, homeScore: number, awayScore: number): Promise<void>;
  
  // Prediction operations
  getPredictions(matchId?: number, limit?: number): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  updatePredictionResult(predictionId: number, isCorrect: boolean, result: string): Promise<void>;
  
  // Analytics operations
  getDashboardStats(): Promise<{
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number;
    activeUsers: number;
    dailyPredictions: number;
    revenue: number;
  }>;
  getModelPerformance(): Promise<ModelPerformance[]>;
  createModelPerformance(performance: InsertModelPerformance): Promise<ModelPerformance>;
  
  // Platform operations
  getPlatformStatus(): Promise<PlatformStatus[]>;
  updatePlatformStatus(platform: string, status: Partial<InsertPlatformStatus>): Promise<void>;
  
  // User subscription operations
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  
  // Activity logs
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Match operations
  async getMatches(limit = 50): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .orderBy(desc(matches.scheduledTime))
      .limit(limit);
  }

  async getUpcomingMatches(limit = 10): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.status, "scheduled"),
          gte(matches.scheduledTime, new Date())
        )
      )
      .orderBy(matches.scheduledTime)
      .limit(limit);
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async updateMatchResult(matchId: number, homeScore: number, awayScore: number): Promise<void> {
    await db
      .update(matches)
      .set({
        homeScore,
        awayScore,
        status: "finished",
      })
      .where(eq(matches.id, matchId));
  }

  // Prediction operations
  async getPredictions(matchId?: number, limit = 50): Promise<Prediction[]> {
    const query = db.select().from(predictions);
    
    if (matchId) {
      return await query
        .where(eq(predictions.matchId, matchId))
        .orderBy(desc(predictions.createdAt))
        .limit(limit);
    }
    
    return await query
      .orderBy(desc(predictions.createdAt))
      .limit(limit);
  }

  async createPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const [newPrediction] = await db.insert(predictions).values(prediction).returning();
    return newPrediction;
  }

  async updatePredictionResult(predictionId: number, isCorrect: boolean, result: string): Promise<void> {
    await db
      .update(predictions)
      .set({ isCorrect, result })
      .where(eq(predictions.id, predictionId));
  }

  // Analytics operations
  async getDashboardStats(): Promise<{
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number;
    activeUsers: number;
    dailyPredictions: number;
    revenue: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total predictions
    const [{ totalPredictions }] = await db
      .select({ totalPredictions: sql<number>`count(*)` })
      .from(predictions);

    // Get correct predictions
    const [{ correctPredictions }] = await db
      .select({ correctPredictions: sql<number>`count(*)` })
      .from(predictions)
      .where(eq(predictions.isCorrect, true));

    // Calculate accuracy
    const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;

    // Get active users (users with activity in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [{ activeUsers }] = await db
      .select({ activeUsers: sql<number>`count(distinct user_id)` })
      .from(activityLogs)
      .where(gte(activityLogs.createdAt, thirtyDaysAgo));

    // Get daily predictions
    const [{ dailyPredictions }] = await db
      .select({ dailyPredictions: sql<number>`count(*)` })
      .from(predictions)
      .where(
        and(
          gte(predictions.createdAt, today),
          lte(predictions.createdAt, tomorrow)
        )
      );

    // Mock revenue calculation (would be based on subscription data)
    const revenue = activeUsers * 25; // Simplified calculation

    return {
      totalPredictions,
      correctPredictions,
      accuracy,
      activeUsers,
      dailyPredictions,
      revenue,
    };
  }

  async getModelPerformance(): Promise<ModelPerformance[]> {
    return await db
      .select()
      .from(modelPerformance)
      .orderBy(desc(modelPerformance.date))
      .limit(10);
  }

  async createModelPerformance(performance: InsertModelPerformance): Promise<ModelPerformance> {
    const [newPerformance] = await db.insert(modelPerformance).values(performance).returning();
    return newPerformance;
  }

  // Platform operations
  async getPlatformStatus(): Promise<PlatformStatus[]> {
    return await db.select().from(platformStatus);
  }

  async updatePlatformStatus(platform: string, status: Partial<InsertPlatformStatus>): Promise<void> {
    await db
      .update(platformStatus)
      .set({ ...status, lastChecked: new Date() })
      .where(eq(platformStatus.platform, platform));
  }

  // User subscription operations
  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(userSubscriptions)
      .where(
        and(
          eq(userSubscriptions.userId, userId),
          eq(userSubscriptions.isActive, true)
        )
      );
    return subscription;
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const [newSubscription] = await db.insert(userSubscriptions).values(subscription).returning();
    return newSubscription;
  }

  // Activity logs
  async getActivityLogs(limit = 20): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }
}

export const storage = new DatabaseStorage();
