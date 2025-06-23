import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from "lucide-react";

interface PredictionCardProps {
  match: {
    id: number;
    league: string;
    homeTeam: string;
    awayTeam: string;
    scheduledTime: string;
    platform: string;
  };
}

export default function PredictionCard({ match }: PredictionCardProps) {
  const timeUntilMatch = () => {
    const now = new Date();
    const matchTime = new Date(match.scheduledTime);
    const diff = matchTime.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 0) return "Live";
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getLeagueIcon = () => {
    const colors = [
      "from-blue-500 to-purple-500",
      "from-green-500 to-blue-500", 
      "from-orange-500 to-red-500"
    ];
    return colors[match.id % colors.length];
  };

  return (
    <Card className="prediction-card bg-surface-light rounded-lg p-4 border border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${getLeagueIcon()} rounded-lg flex items-center justify-center`}>
            <Target className="text-white w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold">{match.league}</h4>
            <p className="text-sm text-gray-400">{match.homeTeam} vs {match.awayTeam}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-3 h-3 text-gray-500" />
              <p className="text-xs text-gray-500">Match starts in {timeUntilMatch()}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg font-bold text-secondary">-%</span>
            <span className="text-sm text-gray-400">confidence</span>
          </div>
          <Badge variant="secondary" className="bg-accent/20 text-accent">
            Prediction Loading...
          </Badge>
          <p className="text-xs text-gray-500 mt-1">Platform: {match.platform}</p>
        </div>
      </div>
    </Card>
  );
}
