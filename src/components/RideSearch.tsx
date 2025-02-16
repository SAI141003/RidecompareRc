
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import type { Database } from "@/integrations/supabase/types";
import type { RideOption } from "@/types/ride";
import { fetchRideOptions } from "@/services/rideService";
import { SearchForm } from "@/components/ride/SearchForm";
import { RideCard } from "@/components/ride/RideCard";
import { getPricePrediction, checkFraudRisk } from "@/services/priceService";
import Map from "@/components/Map";

type Ride = Database['public']['Tables']['rides']['Insert'];

export const RideSearch = () => {
  const { user } = useAuth();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: rides, isLoading, refetch } = useQuery({
    queryKey: ["rides", pickup, dropoff],
    queryFn: async () => {
      const prediction = await getPricePrediction(pickup, dropoff);
      const rideOptions = await fetchRideOptions(pickup, dropoff);
      
      // Adjust ride prices based on prediction
      return rideOptions.map(ride => ({
        ...ride,
        price: ride.price * (prediction.confidence_score > 0.8 ? 1 : 0.9) // Apply discount if low confidence
      }));
    },
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
      // Check for potential fraud
      const fraudCheck = await checkFraudRisk('book_ride', {
        amount: ride.price,
        ride_type: ride.type,
        provider: ride.provider,
      });

      if (fraudCheck.status === 'suspicious') {
        toast.error("Unable to process booking. Please contact support.");
        return;
      }

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
          {/* Show map above the search form */}
          <Map />
          
          <SearchForm
            pickup={pickup}
            setPickup={setPickup}
            dropoff={dropoff}
            setDropoff={setDropoff}
            onSearch={handleSearch}
            isSearching={isSearching}
          />

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
