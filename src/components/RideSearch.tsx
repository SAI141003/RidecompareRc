import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import type { Database } from "@/integrations/supabase/types";
import type { RideOption } from "@/types/ride";
import { RideCard } from "@/components/ride/RideCard";
import { getPricePrediction, checkFraudRisk } from "@/services/priceService";
import { fetchRideOptions } from "@/services/rideService";
import Map from "@/components/Map";
import { LocationSearch } from "@/components/LocationSearch";
import { Button } from "@/components/ui/button";

type Ride = Database['public']['Tables']['rides']['Insert'];

export const RideSearch = () => {
  const { user } = useAuth();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoords, setPickupCoords] = useState<[number, number]>();
  const [dropoffCoords, setDropoffCoords] = useState<[number, number]>();
  const [isSearching, setIsSearching] = useState(false);

  const { data: rides, isLoading, refetch } = useQuery({
    queryKey: ["rides", pickup, dropoff],
    queryFn: async () => {
      const prediction = await getPricePrediction(pickup, dropoff);
      const rideOptions = await fetchRideOptions(pickup, dropoff);
      return rideOptions.map(ride => ({
        ...ride,
        price: ride.price * (prediction.confidence_score > 0.8 ? 1 : 0.9)
      }));
    },
    enabled: false,
  });

  const handleSearch = async () => {
    if (!pickup || !dropoff) {
      toast.error("Please enter both pickup and dropoff locations");
      return;
    }
    setIsSearching(true);
    await refetch();
    setIsSearching(false);
  };

  const handleBookRide = async (ride: RideOption) => {
    let appUrl = '';
    if (ride.provider === 'uber') {
      appUrl = 'https://m.uber.com/ul';
    } else if (ride.provider === 'lyft') {
      appUrl = 'https://lyft.com/ride';
    }

    window.open(appUrl, '_blank');
    toast.success(`Redirecting to ${ride.provider.toUpperCase()}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Find Your Ride
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Map pickup={pickupCoords} dropoff={dropoffCoords} />
          
          <div className="space-y-4">
            <LocationSearch
              placeholder="Enter pickup location"
              value={pickup}
              onChange={setPickup}
              onLocationSelect={setPickupCoords}
            />
            <LocationSearch
              placeholder="Enter dropoff location"
              value={dropoff}
              onChange={setDropoff}
              onLocationSelect={setDropoffCoords}
            />
            <Button 
              onClick={handleSearch} 
              className="w-full"
              disabled={isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search Rides"
              )}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : rides ? (
            <div className="space-y-4 mt-6">
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  onBook={handleBookRide}
                />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
