import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wifi, WifiOff, Settings } from "lucide-react";

export default function PlatformStatus() {
  const { data: platforms, isLoading } = useQuery({
    queryKey: ["/api/platform-status"],
    retry: false,
  });

  const defaultPlatforms = [
    {
      platform: "sportybet",
      status: "online",
      apiStatus: "connected",
      dailyPredictions: 847,
      successRate: 92.1,
      icon: "🏈",
      color: "orange-500",
      label: "SportyBet",
      description: "Primary Platform"
    },
    {
      platform: "bet365",
      status: "online", 
      apiStatus: "connected",
      dailyPredictions: 423,
      successRate: 89.7,
      icon: "🏆",
      color: "blue-500",
      label: "Bet365",
      description: "Secondary Platform"
    },
    {
      platform: "1xbet",
      status: "maintenance",
      apiStatus: "reconnecting",
      dailyPredictions: 162,
      successRate: 86.4,
      icon: "⭐",
      color: "green-500",
      label: "1xBet",
      description: "Tertiary Platform"
    }
  ];

  const platformData = platforms || defaultPlatforms;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-secondary";
      case "maintenance": return "text-accent";
      case "offline": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <Wifi className="w-3 h-3" />;
      case "maintenance": return <Settings className="w-3 h-3" />;
      case "offline": return <WifiOff className="w-3 h-3" />;
      default: return <WifiOff className="w-3 h-3" />;
    }
  };

  return (
    <Card className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Betting Platform Integration</h3>
        <Button className="bg-primary hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Platform
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platformData.map((platform: any, index: number) => (
          <Card key={index} className="bg-surface rounded-lg p-6 border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-${platform.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-lg">{platform.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold">{platform.label}</h4>
                  <p className="text-sm text-gray-400">{platform.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(platform.status)}
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(platform.status)} bg-transparent`}
                >
                  {platform.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">API Status:</span>
                <span className={getStatusColor(platform.status)}>{platform.apiStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Predictions:</span>
                <span>{platform.dailyPredictions?.toLocaleString() || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Success Rate:</span>
                <span className="text-secondary">{platform.successRate?.toFixed(1) || "0"}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
