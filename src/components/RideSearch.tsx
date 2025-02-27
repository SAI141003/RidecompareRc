
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, MapPin } from "lucide-react";
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
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

  const { data: prediction, isLoading: isPredicting } = useQuery({
    queryKey: ["price-prediction", pickup, dropoff],
    queryFn: async () => {
      if (!pickup || !dropoff) return null;
      try {
        console.log('Fetching prediction for:', pickup, dropoff);
        const result = await getPricePrediction(pickup, dropoff);
        console.log('Prediction result:', result);
        return result;
      } catch (error) {
        console.error('Error fetching prediction:', error);
        toast.error('Could not get ride prediction');
        return null;
      }
    },
    enabled: !!(pickup && dropoff),
  });

  const { data: rides = [], isLoading: isLoadingRides, refetch: refetchRides } = useQuery({
    queryKey: ["rides", pickup, dropoff, prediction?.predicted_price],
    queryFn: async () => {
      if (!prediction?.predicted_price) {
        return [];
      }

      const baseRideOptions = await fetchRideOptions(pickup, dropoff);
      
      // Calculate price multipliers based on vehicle type
      const typeMultipliers = {
        "UberX": 1,
        "UberXL": 1.5,
        "Lyft": 0.95,
        "Lyft XL": 1.45,
      };

      // Generate random wait times between 3-12 minutes
      const generateWaitTime = () => Math.floor(Math.random() * 10) + 3;

      // Apply the predicted price and adjustments
      return baseRideOptions.map(ride => {
        const multiplier = typeMultipliers[ride.type as keyof typeof typeMultipliers] || 1;
        const adjustedPrice = prediction.predicted_price * multiplier;
        const travelTime = prediction.details?.estimated_duration || 0;
        const waitTime = generateWaitTime(); // Separate wait time

        return {
          ...ride,
          price: Number(adjustedPrice.toFixed(2)),
          surge: prediction.details?.surge_multiplier > 1,
          eta: waitTime, // Wait time for pickup
          time: travelTime, // Actual travel time
        };
      });
    },
    enabled: !!(prediction?.predicted_price),
  });

  const getCurrentLocation = () => {
    setIsLoadingCurrentLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use more detailed reverse geocoding query
            const response = await fetch(
              `https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}&limit=1`
            );
            const data = await response.json();
            if (data.features && data.features[0]) {
              const feature = data.features[0].properties;
              // Build a more detailed address string
              const addressParts = [];
              
              if (feature.housenumber) addressParts.push(feature.housenumber);
              if (feature.street) addressParts.push(feature.street);
              if (feature.name && !feature.street) addressParts.push(feature.name);
              if (feature.district) addressParts.push(feature.district);
              if (feature.city) addressParts.push(feature.city);
              if (feature.state) addressParts.push(feature.state);
              if (feature.country) addressParts.push(feature.country);
              
              const address = addressParts.filter(Boolean).join(", ");
              
              setPickup(address);
              setPickupCoords([latitude, longitude]);
              toast.success("Current location detected");
            } else {
              throw new Error('Location details not found');
            }
          } catch (error) {
            console.error("Error getting address:", error);
            toast.error("Could not get your exact address, please enter manually");
            // Still set the coordinates even if we can't get the address
            setPickupCoords([latitude, longitude]);
          }
          setIsLoadingCurrentLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not access your location. Please check your browser settings.");
          setIsLoadingCurrentLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error("Location services are not supported by your browser");
      setIsLoadingCurrentLocation(false);
    }
  };

  const handleSearch = async () => {
    if (!pickup || !dropoff) {
      toast.error("Please enter both pickup and dropoff locations");
      return;
    }
    setIsSearching(true);
    try {
      await refetchRides();
    } catch (error) {
      console.error('Error searching rides:', error);
      toast.error('Could not find rides for this route');
    }
    setIsSearching(false);
  };

  const handleBookRide = async (ride: RideOption) => {
    let appUrl = '';
    if (ride.provider === 'uber') {
      appUrl = 'https://m.uber.com/ul';
    } else if (ride.provider === 'lyft') {
      appUrl = 'https://lyft.com/ride';
    }

    // Add pickup and dropoff locations to the URL if available
    if (pickupCoords && dropoffCoords) {
      const params = new URLSearchParams({
        pickup: `${pickupCoords[0]},${pickupCoords[1]}`,
        dropoff: `${dropoffCoords[0]},${dropoffCoords[1]}`
      });
      appUrl += `?${params.toString()}`;
    }

    window.open(appUrl, '_blank');
    toast.success(`Redirecting to ${ride.provider.toUpperCase()}`);
  };

  const getDistanceText = () => {
    if (prediction?.details?.estimated_distance) {
      const { miles, kilometers } = prediction.details.estimated_distance;
      return `${miles.toFixed(1)} mi (${kilometers.toFixed(1)} km)`;
    }
    return null;
  };

  const getTimeText = () => {
    if (prediction?.details?.estimated_duration) {
      const minutes = prediction.details.estimated_duration;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (hours > 0) {
        return `${hours}h ${remainingMinutes}min`;
      }
      return `${remainingMinutes}min`;
    }
    return null;
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
            <div className="relative">
              <LocationSearch
                placeholder="Enter pickup location"
                value={pickup}
                onChange={setPickup}
                onLocationSelect={setPickupCoords}
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={getCurrentLocation}
                disabled={isLoadingCurrentLocation}
              >
                {isLoadingCurrentLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>

            <LocationSearch
              placeholder="Enter dropoff location"
              value={dropoff}
              onChange={setDropoff}
              onLocationSelect={setDropoffCoords}
            />

            {prediction?.details && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                {getDistanceText() && (
                  <span>Distance: {getDistanceText()}</span>
                )}
                {getTimeText() && (
                  <span>Est. travel time: {getTimeText()}</span>
                )}
              </div>
            )}

            {prediction?.details?.surge_multiplier > 1 && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Surge pricing in effect ({prediction.details.surge_multiplier}x)
                </p>
              </div>
            )}

            <Button 
              onClick={handleSearch} 
              className="w-full"
              disabled={isSearching || isPredicting || !pickup || !dropoff}
            >
              {isSearching || isPredicting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Search Rides"
              )}
            </Button>
          </div>

          {(isLoadingRides || isPredicting) ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : rides && rides.length > 0 ? (
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
