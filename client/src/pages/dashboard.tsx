import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/sidebar";
import MetricsCards from "@/components/metrics-cards";
import PredictionCard from "@/components/prediction-card";
import PerformanceChart from "@/components/performance-chart";
import PlatformStatus from "@/components/platform-status";
import ActivityFeed from "@/components/activity-feed";
import { Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: upcomingMatches, isLoading: matchesLoading } = useQuery({
    queryKey: ["/api/matches/upcoming"],
    retry: false,
  });

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ["/api/predictions"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-surface border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <p className="text-gray-400">Real-time virtual football predictions and analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-secondary/20 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-sm text-secondary font-medium">System Online</span>
              </div>
              <Button variant="ghost" size="sm" className="bg-surface-light hover:bg-gray-600">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="bg-surface-light hover:bg-gray-600">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <MetricsCards />

          {/* Live Predictions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Live Predictions</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Auto-refresh:</span>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {predictionsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-surface-light rounded-lg p-4 animate-pulse">
                          <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : upcomingMatches && upcomingMatches.length > 0 ? (
                    upcomingMatches.slice(0, 3).map((match: any) => (
                      <PredictionCard key={match.id} match={match} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No upcoming matches available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Today's Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Successful Predictions</span>
                    <span className="font-bold text-secondary">-/-</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Average Confidence</span>
                    <span className="font-bold text-blue-400">-%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Active Models</span>
                    <span className="font-bold text-accent">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Platform Coverage</span>
                    <span className="font-bold text-purple-400">3/3</span>
                  </div>
                </div>
              </div>
              
              {/* Subscription Tiers */}
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Subscription Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div>
                      <p className="font-medium">Free Tier</p>
                      <p className="text-sm text-gray-400">- users</p>
                    </div>
                    <span className="text-gray-400">-%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div>
                      <p className="font-medium text-accent">Premium</p>
                      <p className="text-sm text-gray-400">- users</p>
                    </div>
                    <span className="text-accent">-%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div>
                      <p className="font-medium text-purple-400">VIP</p>
                      <p className="text-sm text-gray-400">- users</p>
                    </div>
                    <span className="text-purple-400">-%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart />
            
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">ML Model Performance</h3>
                <Button variant="link" className="text-primary hover:text-blue-300 text-sm p-0">
                  View Details →
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  { name: "XGBoost Model", accuracy: "92.1%", predictions: "847", color: "secondary" },
                  { name: "Random Forest", accuracy: "89.3%", predictions: "652", color: "blue-400" },
                  { name: "Neural Network", accuracy: "87.8%", predictions: "431", color: "accent" },
                  { name: "SVM Model", accuracy: "84.2%", predictions: "329", color: "purple-400" },
                ].map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 bg-${model.color} rounded-full`}></div>
                      <span>{model.name}</span>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-${model.color}`}>{model.accuracy}</p>
                      <p className="text-xs text-gray-400">{model.predictions} predictions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Integration Status */}
          <PlatformStatus />

          {/* Recent Activity Feed */}
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
}
