import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Goal, Users, BarChart3, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MetricsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const metrics = [
    {
      title: "Prediction Accuracy",
      value: stats ? `${stats.accuracy.toFixed(1)}%` : "-%",
      change: "+5.2% from last week",
      icon: Goal,
      color: "secondary",
      bgColor: "bg-secondary/20",
    },
    {
      title: "Active Users",
      value: stats ? stats.activeUsers.toLocaleString() : "-",
      change: "+12% this month",
      icon: Users,
      color: "blue-400",
      bgColor: "bg-blue-400/20",
    },
    {
      title: "Daily Predictions",
      value: stats ? stats.dailyPredictions.toLocaleString() : "-",
      change: "24h volume",
      icon: BarChart3,
      color: "accent",
      bgColor: "bg-accent/20",
    },
    {
      title: "Revenue",
      value: stats ? `$${stats.revenue.toLocaleString()}` : "$-",
      change: "This month",
      icon: DollarSign,
      color: "purple-400",
      bgColor: "bg-purple-400/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{metric.title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : (
                <p className={`text-3xl font-bold text-${metric.color}`}>
                  {metric.value}
                </p>
              )}
              <p className={`text-sm text-${metric.color}`}>{metric.change}</p>
            </div>
            <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
              <metric.icon className={`text-${metric.color} text-xl`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
