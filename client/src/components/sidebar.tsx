import { useAuth } from "@/hooks/useAuth";
import { 
  Brain, 
  BarChart3, 
  History, 
  Bot, 
  Users, 
  Layers, 
  Settings, 
  LogOut,
  Gauge
} from "lucide-react";
import { FaTelegram } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    { icon: Gauge, label: "Dashboard", active: true, badge: null },
    { icon: BarChart3, label: "Live Predictions", active: false, badge: "12" },
    { icon: History, label: "Performance Analytics", active: false, badge: null },
    { icon: Bot, label: "ML Models", active: false, badge: null },
    { icon: Users, label: "User Management", active: false, badge: null },
    { icon: Layers, label: "Betting Platforms", active: false, badge: null },
    { icon: FaTelegram, label: "Telegram Bot", active: false, badge: null },
    { icon: Settings, label: "Settings", active: false, badge: null },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <Brain className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold">SportyBet AI</h1>
            <p className="text-sm text-gray-400">Predictor Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${
              item.active
                ? "bg-primary/20 text-primary border border-primary/30"
                : "hover:bg-surface-light"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-secondary text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-surface-light">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "Admin User"
              }
            </p>
            <p className="text-xs text-gray-400">
              {user?.email || "admin@example.com"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = "/api/logout"}
            className="text-gray-400 hover:text-gray-300 p-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
