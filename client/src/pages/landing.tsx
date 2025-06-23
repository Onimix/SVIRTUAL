import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BarChart3, Users, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SportyBet AI</h1>
              <p className="text-sm text-gray-400">Predictor Dashboard</p>
            </div>
          </div>
          <Button onClick={() => window.location.href = '/api/login'} className="bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI-Powered Virtual Football Predictions
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Enhanced virtual football prediction system with machine learning models, 
            real-time analytics, and multi-platform support for SportyBet, Bet365, and 1xBet.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 text-lg"
          >
            Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <Card className="glass-effect border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ML Models</h3>
              <p className="text-gray-400 text-sm">
                Advanced machine learning algorithms for sophisticated predictions
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-400 text-sm">
                Live prediction accuracy tracking and performance metrics
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Platform</h3>
              <p className="text-gray-400 text-sm">
                Support for SportyBet, Bet365, 1xBet and more platforms
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Automated</h3>
              <p className="text-gray-400 text-sm">
                Scheduled predictions and real-time notifications
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
