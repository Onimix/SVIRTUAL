import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionTier: varchar("subscription_tier").default("free"), // free, premium, vip
  telegramUserId: varchar("telegram_user_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Virtual football matches
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  matchId: varchar("match_id").notNull().unique(), // External match ID from betting platform
  platform: varchar("platform").notNull(), // sportybet, bet365, 1xbet
  league: varchar("league").notNull(),
  homeTeam: varchar("home_team").notNull(),
  awayTeam: varchar("away_team").notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  actualStartTime: timestamp("actual_start_time"),
  status: varchar("status").default("scheduled"), // scheduled, live, finished, cancelled
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  metadata: jsonb("metadata"), // Additional match data
  createdAt: timestamp("created_at").defaultNow(),
});

// Predictions made by ML models
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  predictionType: varchar("prediction_type").notNull(), // under_2_5, btts, home_win, etc.
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  mlModel: varchar("ml_model").notNull(), // xgboost, random_forest, neural_network, svm
  prediction: varchar("prediction").notNull(), // The actual prediction value
  odds: decimal("odds", { precision: 10, scale: 2 }),
  isCorrect: boolean("is_correct"),
  result: varchar("result"), // The actual outcome
  createdAt: timestamp("created_at").defaultNow(),
});

// User subscriptions and preferences
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  tier: varchar("tier").notNull(), // free, premium, vip
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  platforms: jsonb("platforms"), // Array of enabled platforms
  preferences: jsonb("preferences"), // Notification preferences, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// ML Model performance tracking
export const modelPerformance = pgTable("model_performance", {
  id: serial("id").primaryKey(),
  modelName: varchar("model_name").notNull(),
  date: timestamp("date").notNull(),
  totalPredictions: integer("total_predictions").notNull(),
  correctPredictions: integer("correct_predictions").notNull(),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }).notNull(),
  averageConfidence: decimal("average_confidence", { precision: 5, scale: 2 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform integration status
export const platformStatus = pgTable("platform_status", {
  id: serial("id").primaryKey(),
  platform: varchar("platform").notNull().unique(),
  status: varchar("status").notNull(), // online, offline, maintenance
  apiStatus: varchar("api_status").notNull(), // connected, disconnected, error
  lastChecked: timestamp("last_checked").defaultNow(),
  dailyPredictions: integer("daily_predictions").default(0),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }),
  metadata: jsonb("metadata"),
});

// System activity logs
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // prediction_success, user_signup, model_retrain, etc.
  description: text("description").notNull(),
  userId: varchar("user_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const matchesRelations = relations(matches, ({ many }) => ({
  predictions: many(predictions),
}));

export const predictionsRelations = relations(predictions, ({ one }) => ({
  match: one(matches, {
    fields: [predictions.matchId],
    references: [matches.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(userSubscriptions),
  activityLogs: many(activityLogs),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [userSubscriptions.userId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  subscriptionTier: true,
  telegramUserId: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertModelPerformanceSchema = createInsertSchema(modelPerformance).omit({
  id: true,
  createdAt: true,
});

export const insertPlatformStatusSchema = createInsertSchema(platformStatus).omit({
  id: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema> & { id: string };
export type User = typeof users.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type ModelPerformance = typeof modelPerformance.$inferSelect;
export type InsertModelPerformance = z.infer<typeof insertModelPerformanceSchema>;
export type PlatformStatus = typeof platformStatus.$inferSelect;
export type InsertPlatformStatus = z.infer<typeof insertPlatformStatusSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
