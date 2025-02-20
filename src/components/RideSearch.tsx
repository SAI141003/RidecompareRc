
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { RideOption } from "@/types/ride";
import { getPricePrediction } from "@/services/priceService";
import { fetchRideOptions } from "@/services/rideService";
import Map from "@/components/Map";
import { LocationSearch } from "@/components/LocationSearch";
import { Button } from "@/components/ui/button";
import { RideCard } from "@/components/ride/RideCard";

export const RideSearch = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoords, setPickupCoords] = useState<[number, number]>();
  const [dropoffCoords, setDropoffCoords] = useState<[number, number]>();
  const [isSearching, setIsSearching] = useState(false);
  const [debug, setDebug] = useState<any>(null);

  const { data: prediction, isLoading: isPredicting } = useQuery({
    queryKey: ["price-prediction", pickup, dropoff],
    queryFn: async () => {
      const result = await getPricePrediction(pickup, dropoff);
      setDebug(result); // Store debug info
      return result;
    },
    enabled: !!(pickup && dropoff),
  });

  const { data: rides, isLoading: isLoadingRides, refetch } = useQuery({
    queryKey: ["rides", pickup, dropoff],
    queryFn: async () => {
      const rideOptions = await fetchRideOptions(pickup, dropoff);
      return rideOptions.map(ride => ({
        ...ride,
        price: ride.price * (prediction?.details?.surge_multiplier || 1),
        surge: prediction?.details?.surge_multiplier > 1,
        eta: prediction?.details?.estimated_duration || ride.eta,
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

            {prediction?.details?.surge_multiplier > 1 && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Surge pricing in effect ({prediction.details.surge_multiplier}x)
                </p>
              </div>
            )}

            {/* Debug Info */}
            {debug && (
              <div className="p-2 bg-gray-50 rounded-md text-xs font-mono">
                <p>Distance: {debug.details?.estimated_distance.toFixed(2)} miles</p>
                <p>Duration: {debug.details?.estimated_duration} mins</p>
                <p>Base Fare: ${debug.details?.base_fare}</p>
                <p>Distance Charge: ${debug.details?.distance_charge}</p>
                <p>Time Charge: ${debug.details?.time_charge}</p>
                <p>Service Fee: ${debug.details?.service_fee}</p>
                <p>Surge: {debug.details?.surge_multiplier}x</p>
                <p>Final Price: ${debug.predicted_price}</p>
              </div>
            )}

            <Button 
              onClick={handleSearch} 
              className="w-full"
              disabled={isSearching || isPredicting}
            >
              {isSearching || isPredicting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search Rides"
              )}
            </Button>
          </div>

          {(isLoadingRides || isPredicting) ? (
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
