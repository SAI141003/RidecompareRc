
import { RideSearch } from "@/components/RideSearch";
import { HotelSearch } from "@/components/hotel/HotelSearch";
import { RentalCarSearch } from "@/components/rental/RentalCarSearch";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Link, Link2Off, Sparkles } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { connectProvider, disconnectProvider, getConnectedProviders } from "@/services/rideService";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const features = ["Google Flights", "DoorDash", "Skip", "Instacart"];
  const [currentFeature, setCurrentFeature] = useState(0);
  const [activeTab, setActiveTab] = useState<'rides' | 'hotels' | 'rentals'>('rides');

  const { data: connectedProviders, refetch: refetchProviders } = useQuery({
    queryKey: ['connected-providers'],
    queryFn: getConnectedProviders,
  });

  const handleConnect = async (provider: 'uber' | 'lyft') => {
    try {
      await connectProvider(provider);
      await refetchProviders();
      toast.success(`Successfully connected to ${provider.toUpperCase()}`);
    } catch (error: any) {
      toast.error(`Failed to connect to ${provider.toUpperCase()}: ${error.message}`);
    }
  };

  const handleDisconnect = async (provider: 'uber' | 'lyft') => {
    try {
      await disconnectProvider(provider);
      await refetchProviders();
      toast.success(`Successfully disconnected from ${provider.toUpperCase()}`);
    } catch (error: any) {
      toast.error(`Failed to disconnect from ${provider.toUpperCase()}: ${error.message}`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const isConnected = (provider: 'uber' | 'lyft') => {
    return connectedProviders?.some(p => p.provider_type === provider);
  };

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
            Your journey begins here. Find and book rides, rentals, and hotels with ease.
          </p>

          {activeTab === 'rides' && (
            <div className="w-full max-w-md">
              <Card className="bg-gradient-to-br from-white to-gray-50 shadow-md border border-gray-100 overflow-hidden">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></div>
                    Connected Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 flex flex-wrap gap-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-2">
                      <div className={`flex items-center ${isConnected('uber') ? 'opacity-100' : 'opacity-70'}`}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-black">
                          <Car className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs font-medium ml-1">Uber</span>
                        {isConnected('uber') && (
                          <Badge variant="success" className="ml-1 px-1.5 py-0 text-[10px]">
                            Connected
                          </Badge>
                        )}
                      </div>
                      
                      <div className={`flex items-center ml-4 ${isConnected('lyft') ? 'opacity-100' : 'opacity-70'}`}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-pink-600">
                          <Car className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs font-medium ml-1">Lyft</span>
                        {isConnected('lyft') && (
                          <Badge variant="purple" className="ml-1 px-1.5 py-0 text-[10px]">
                            Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!isConnected('uber') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleConnect('uber')}
                        >
                          <Link className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      )}
                      {!isConnected('lyft') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleConnect('lyft')}
                        >
                          <Link className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      )}
                      {(isConnected('uber') || isConnected('lyft')) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                          onClick={() => {
                            if (isConnected('uber')) handleDisconnect('uber');
                            if (isConnected('lyft')) handleDisconnect('lyft');
                          }}
                        >
                          <Link2Off className="h-3 w-3 mr-1" />
                          Disconnect All
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              variant={activeTab === 'rides' ? 'default' : 'outline'}
              onClick={() => setActiveTab('rides')}
            >
              Rides
            </Button>
            <Button
              variant={activeTab === 'rentals' ? 'default' : 'outline'}
              onClick={() => setActiveTab('rentals')}
            >
              Rentals
            </Button>
            <Button
              variant={activeTab === 'hotels' ? 'default' : 'outline'}
              onClick={() => setActiveTab('hotels')}
            >
              Hotels
            </Button>
          </div>
          <RouterLink to="/coming-soon">
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
          </RouterLink>
        </div>

        {activeTab === 'rides' ? (
          <RideSearch />
        ) : activeTab === 'hotels' ? (
          <HotelSearch />
        ) : (
          <RentalCarSearch />
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
