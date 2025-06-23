import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { CheckCircle, UserPlus, Settings, MessageCircle } from "lucide-react";
import { FaTelegram } from "react-icons/fa";

export default function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activity-logs"],
    retry: false,
  });

  const defaultActivities = [
    {
      type: "prediction_success",
      description: "Successful prediction for VPL2024 match",
      details: "Manchester United vs Liverpool - Under 2.5 Goals predicted correctly",
      time: "2 minutes ago",
      value: "+94%",
      icon: CheckCircle,
      iconColor: "secondary",
      iconBg: "bg-secondary/20"
    },
    {
      type: "user_signup",
      description: "New premium subscription", 
      details: "User upgraded from Free to Premium tier",
      time: "7 minutes ago",
      value: "$29",
      icon: UserPlus,
      iconColor: "blue-400",
      iconBg: "bg-blue-400/20"
    },
    {
      type: "model_retrain",
      description: "ML model retrained",
      details: "XGBoost model updated with latest match data", 
      time: "15 minutes ago",
      value: "v2.1.3",
      icon: Settings,
      iconColor: "accent",
      iconBg: "bg-accent/20"
    },
    {
      type: "telegram_notification",
      description: "Telegram bot notification sent",
      details: "Batch prediction alert delivered to 1,247 subscribers",
      time: "23 minutes ago", 
      value: "1.2K",
      icon: FaTelegram,
      iconColor: "purple-400",
      iconBg: "bg-purple-400/20"
    }
  ];

  const activityData = activities || defaultActivities;

  return (
    <Card className="glass-effect rounded-xl p-6">
      <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-4 p-4 bg-surface rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-600 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/4"></div>
                </div>
                <div className="w-12 h-4 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          activityData.map((activity: any, index: number) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-surface rounded-lg">
              <div className={`w-10 h-10 ${activity.iconBg} rounded-lg flex items-center justify-center`}>
                <activity.icon className={`text-${activity.iconColor} w-5 h-5`} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.description}</p>
                <p className="text-sm text-gray-400">{activity.details}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span className={`text-${activity.iconColor} font-mono text-sm`}>
                {activity.value}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
