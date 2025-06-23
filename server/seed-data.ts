import { storage } from "./storage";

export async function seedInitialData() {
  try {
    console.log("🌱 Seeding initial data...");

    // Seed platform status
    const platforms = [
      {
        platform: "sportybet",
        status: "online",
        apiStatus: "connected",
        dailyPredictions: 847,
        successRate: "92.1",
        metadata: { lastUpdate: new Date(), version: "v1.0" }
      },
      {
        platform: "bet365",
        status: "online",
        apiStatus: "connected",
        dailyPredictions: 423,
        successRate: "89.7",
        metadata: { lastUpdate: new Date(), version: "v1.0" }
      },
      {
        platform: "1xbet",
        status: "maintenance",
        apiStatus: "reconnecting",
        dailyPredictions: 162,
        successRate: "86.4",
        metadata: { lastUpdate: new Date(), version: "v1.0", maintenanceEnd: new Date(Date.now() + 2 * 60 * 60 * 1000) }
      }
    ];

    // Insert platform statuses
    for (const platform of platforms) {
      try {
        await storage.updatePlatformStatus(platform.platform, platform);
      } catch (error) {
        // If update fails, try inserting first
        const { db } = await import("./db");
        const { platformStatus } = await import("@shared/schema");
        await db.insert(platformStatus).values(platform);
      }
    }

    // Seed sample virtual matches
    const sampleMatches = [
      {
        matchId: "vpl_2024_001",
        platform: "sportybet",
        league: "Virtual Premier League 2024",
        homeTeam: "Arsenal VFC",
        awayTeam: "Chelsea VFC",
        scheduledTime: new Date(Date.now() + 10 * 60 * 1000),
        status: "scheduled",
        metadata: { competition: "Premier", round: 1 }
      },
      {
        matchId: "vpl_2024_002", 
        platform: "bet365",
        league: "Virtual Champions League",
        homeTeam: "Barcelona VFC",
        awayTeam: "Real Madrid VFC",
        scheduledTime: new Date(Date.now() + 15 * 60 * 1000),
        status: "scheduled",
        metadata: { competition: "Champions", round: 1 }
      },
      {
        matchId: "vpl_2024_003",
        platform: "sportybet",
        league: "Virtual Premier League 2024",
        homeTeam: "Manchester City VFC",
        awayTeam: "Liverpool VFC",
        scheduledTime: new Date(Date.now() + 20 * 60 * 1000),
        status: "scheduled",
        metadata: { competition: "Premier", round: 1 }
      }
    ];

    for (const match of sampleMatches) {
      await storage.createMatch(match);
    }

    // Seed initial model performance data
    const modelPerformanceData = [
      {
        modelName: "xgboost",
        date: new Date(),
        totalPredictions: 847,
        correctPredictions: 780,
        accuracy: "92.1",
        averageConfidence: "0.85",
        metadata: { version: "v2.1.3", trainingDate: new Date() }
      },
      {
        modelName: "randomForest",
        date: new Date(),
        totalPredictions: 652,
        correctPredictions: 582,
        accuracy: "89.3",
        averageConfidence: "0.78",
        metadata: { version: "v1.9.2", trainingDate: new Date() }
      },
      {
        modelName: "neuralNetwork",
        date: new Date(),
        totalPredictions: 431,
        correctPredictions: 378,
        accuracy: "87.8",
        averageConfidence: "0.82",
        metadata: { version: "v3.0.1", trainingDate: new Date() }
      },
      {
        modelName: "svm",
        date: new Date(),
        totalPredictions: 329,
        correctPredictions: 277,
        accuracy: "84.2",
        averageConfidence: "0.73",
        metadata: { version: "v1.5.4", trainingDate: new Date() }
      }
    ];

    for (const performance of modelPerformanceData) {
      await storage.createModelPerformance(performance);
    }

    // Seed activity logs
    const activityLogs = [
      {
        type: "system_startup",
        description: "Virtual Football Prediction System initialized",
        metadata: { timestamp: new Date(), modules: ["ml_engine", "websocket", "telegram_bot"] }
      },
      {
        type: "model_update", 
        description: "XGBoost model updated with latest training data",
        metadata: { modelName: "xgboost", version: "v2.1.3", accuracy: 92.1 }
      },
      {
        type: "platform_connected",
        description: "Successfully connected to SportyBet WebSocket",
        metadata: { platform: "sportybet", connectionTime: new Date() }
      }
    ];

    for (const log of activityLogs) {
      await storage.createActivityLog(log);
    }

    console.log("✅ Initial data seeded successfully");
    
  } catch (error) {
    console.error("❌ Error seeding initial data:", error);
  }
}