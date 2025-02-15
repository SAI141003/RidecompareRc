
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  CarTaxiFront, 
  Loader2, 
  MapPin, 
  TrendingUp 
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import type { Database } from "@/integrations/supabase/types";

type Ride = Database['public']['Tables']['rides']['Insert'];

interface RideOption {
  id: string;
  provider: "uber" | "lyft";
  type: string;
  capacity: number;
  price: number;
  eta: number;
  surge: boolean;
}

// Mock function to simulate API calls to ride-sharing services
const fetchRideOptions = async (pickup: string, dropoff: string): Promise<RideOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock ride options
  return [
    {
      id: "uber-x",
      provider: "uber",
      type: "UberX",
      capacity: 4,
      price: 25.99,
      eta: 5,
      surge: false,
    },
    {
      id: "uber-xl",
      provider: "uber",
      type: "UberXL",
      capacity: 6,
      price: 35.99,
      eta: 8,
      surge: true,
    },
    {
      id: "lyft-standard",
      provider: "lyft",
      type: "Lyft",
      capacity: 4,
      price: 24.99,
      eta: 4,
      surge: false,
    },
    {
      id: "lyft-xl",
      provider: "lyft",
      type: "Lyft XL",
      capacity: 6,
      price: 34.99,
      eta: 7,
      surge: true,
    },
  ];
};

export const RideSearch = () => {
  const { user } = useAuth();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: rides, isLoading, refetch } = useQuery({
    queryKey: ["rides", pickup, dropoff],
    queryFn: () => fetchRideOptions(pickup, dropoff),
    enabled: false, // Don't fetch automatically
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
    if (!user) {
      toast.error("Please log in to book a ride");
      return;
    }

    try {
      const { error } = await supabase
        .from('rides')
        .insert({
          user_id: user.id,
          provider: ride.provider,
          ride_type: ride.type,
          pickup_location: pickup,
          dropoff_location: dropoff,
          price: ride.price,
          status: 'pending'
        } satisfies Ride);

      if (error) throw error;

      toast.success("Ride booked successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
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
          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pickup Location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Dropoff Location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
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
                <Card key={ride.id} className="bg-white/90">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      {ride.provider === "uber" ? (
                        <Car className="h-8 w-8 text-black" />
                      ) : (
                        <CarTaxiFront className="h-8 w-8 text-pink-600" />
                      )}
                      <div>
                        <h3 className="font-semibold">{ride.type}</h3>
                        <div className="text-sm text-gray-500 space-x-2">
                          <span>{ride.capacity} seats</span>
                          <span>•</span>
                          <span>{ride.eta} mins</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">${ride.price.toFixed(2)}</span>
                        {ride.surge && (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <Button
                        onClick={() => handleBookRide(ride)}
                        variant="outline"
                        className="mt-2"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
