import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PerformanceChart() {
  return (
    <Card className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Prediction Accuracy Trend</h3>
        <Select defaultValue="7days">
          <SelectTrigger className="w-40 bg-surface border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-64 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 bg-surface rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p>Chart will be available when historical data is populated</p>
          <p className="text-sm mt-2">Integrate with Chart.js or Recharts for visualization</p>
        </div>
      </div>
    </Card>
  );
}
