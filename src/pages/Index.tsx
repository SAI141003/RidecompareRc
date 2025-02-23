
import { RideSearch } from "@/components/RideSearch";
import { HotelSearch } from "@/components/hotel/HotelSearch";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useState } from "react";

const Index = () => {
  const features = ["Google Flights", "DoorDash", "Skip", "Instacart"];
  const [currentFeature, setCurrentFeature] = useState(0);
  const [activeTab, setActiveTab] = useState<'rides' | 'hotels'>('rides');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-20">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8 animate-fade-up">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-white">RC</span>
          </div>
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to RideCompare
          </h1>
          <p className="text-sm text-gray-600 text-center max-w-sm">
            Your journey begins here. Find and book rides and hotels with ease.
          </p>
          <div className="flex space-x-4">
            <Button
              variant={activeTab === 'rides' ? 'default' : 'outline'}
              onClick={() => setActiveTab('rides')}
            >
              Rides
            </Button>
            <Button
              variant={activeTab === 'hotels' ? 'default' : 'outline'}
              onClick={() => setActiveTab('hotels')}
            >
              Hotels
            </Button>
          </div>
          <Link to="/coming-soon">
            <Button 
              variant="outline" 
              className="group relative overflow-hidden border-2 border-purple-500 hover:border-blue-500 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="mr-2 h-4 w-4 text-purple-500 group-hover:text-blue-500 transition-colors" />
              <div className="flex flex-col items-center">
                <span>Upcoming Features</span>
                <span className="text-sm text-purple-500 group-hover:text-blue-500 transition-colors animate-fade-in">
                  {features[currentFeature]}
                </span>
              </div>
              <ArrowRight className="ml-2 h-4 w-4 text-purple-500 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </Button>
          </Link>
        </div>

        {activeTab === 'rides' ? (
          <RideSearch />
        ) : (
          <HotelSearch />
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
