import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { predictionEngine } from "./prediction-engine";
import { telegramBot } from "./telegram-bot";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard API routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/predictions', isAuthenticated, async (req, res) => {
    try {
      const { matchId, limit } = req.query;
      const predictions = await storage.getPredictions(
        matchId ? parseInt(matchId as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  app.get('/api/matches/upcoming', isAuthenticated, async (req, res) => {
    try {
      const { limit } = req.query;
      const matches = await storage.getUpcomingMatches(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(matches);
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
      res.status(500).json({ message: "Failed to fetch upcoming matches" });
    }
  });

  app.get('/api/model-performance', isAuthenticated, async (req, res) => {
    try {
      const performance = await storage.getModelPerformance();
      res.json(performance);
    } catch (error) {
      console.error("Error fetching model performance:", error);
      res.status(500).json({ message: "Failed to fetch model performance" });
    }
  });

  app.get('/api/platform-status', isAuthenticated, async (req, res) => {
    try {
      const status = await storage.getPlatformStatus();
      res.json(status);
    } catch (error) {
      console.error("Error fetching platform status:", error);
      res.status(500).json({ message: "Failed to fetch platform status" });
    }
  });

  app.get('/api/activity-logs', isAuthenticated, async (req, res) => {
    try {
      const { limit } = req.query;
      const logs = await storage.getActivityLogs(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Subscription management
  app.get('/api/user/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscription = await storage.getUserSubscription(userId);
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching user subscription:", error);
      res.status(500).json({ message: "Failed to fetch user subscription" });
    }
  });

  // Prediction engine control
  app.post('/api/predictions/start-engine', isAuthenticated, async (req, res) => {
    try {
      predictionEngine.connect();
      res.json({ message: "Prediction engine started", status: "connected" });
    } catch (error) {
      console.error("Error starting prediction engine:", error);
      res.status(500).json({ message: "Failed to start prediction engine" });
    }
  });

  app.get('/api/predictions/engine-status', isAuthenticated, async (req, res) => {
    try {
      const status = predictionEngine.getStatus();
      res.json(status);
    } catch (error) {
      console.error("Error fetching engine status:", error);
      res.status(500).json({ message: "Failed to fetch engine status" });
    }
  });

  // Generate sample predictions for testing
  app.post('/api/predictions/generate-sample', isAuthenticated, async (req, res) => {
    try {
      // Create sample upcoming match
      const sampleMatch = await storage.createMatch({
        matchId: `sample_${Date.now()}`,
        platform: "sportybet",
        league: "Virtual Premier League 2024",
        homeTeam: "Manchester United VFC",
        awayTeam: "Liverpool VFC", 
        scheduledTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        status: "scheduled",
        metadata: { source: "sample_generation" }
      });

      res.json({ 
        message: "Sample match created with scheduled predictions",
        match: sampleMatch
      });
    } catch (error) {
      console.error("Error generating sample predictions:", error);
      res.status(500).json({ message: "Failed to generate sample predictions" });
    }
  });

  const httpServer = createServer(app);
  
  // Start prediction engine on server startup
  console.log("🚀 Starting Virtual Football Prediction Engine...");
  predictionEngine.connect();
  
  return httpServer;
}
