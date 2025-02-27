
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  Car, 
  MapPin, 
  Filter, 
  Loader2, 
  TrendingDown,
  TrendingUp,
  Minus
} from "lucide-react";
import { LocationSearch } from "@/components/LocationSearch";
import { toast } from "sonner";
import { 
  getRentalCarOptions, 
  type RentalCarOption,
  predictRentalPriceTrend,
  getNearbyRentalLocations
} from "@/services/rentalCarService";
import { RentalCarCard } from "./RentalCarCard";
import { RentalLocationCard } from "./RentalLocationCard";

export const RentalCarSearch = () => {
  // Location state
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupCoords, setPickupCoords] = useState<[number, number]>();
  const [sameDropoff, setSameDropoff] = useState(true);
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dropoffCoords, setDropoffCoords] = useState<[number, number]>();
  
  // Date state
  const today = new Date();
  const [pickupDate, setPickupDate] = useState<Date>(today);
  const [returnDate, setReturnDate] = useState<Date>(addDays(today, 3));
  
  // Filter state
  const [carCategory, setCarCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  
  // Sort state
  const [sortBy, setSortBy] = useState<"price" | "rating">("price");
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Fetch rental car options
  const { 
    data: rentalOptions = [], 
    isLoading: isLoadingRentals,
    refetch: refetchRentals
  } = useQuery({
    queryKey: ["rental-options", pickupLocation, dropoffLocation, pickupDate, returnDate, carCategory, selectedProviders, priceRange],
    queryFn: async () => {
      if (!pickupLocation) return [];
      
      try {
        const formattedPickupDate = format(pickupDate, "yyyy-MM-dd");
        const formattedReturnDate = format(returnDate, "yyyy-MM-dd");
        
        const options = await getRentalCarOptions({
          pickup: pickupLocation,
          dropoff: sameDropoff ? undefined : dropoffLocation,
          pickupDate: formattedPickupDate,
          returnDate: formattedReturnDate,
          category: carCategory || undefined,
          providers: selectedProviders.length > 0 ? selectedProviders : undefined,
          minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
          maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined
        });
        
        // Sort options
        return sortOptions(options, sortBy);
      } catch (error) {
        console.error("Error fetching rental options:", error);
        toast.error("Failed to fetch rental car options");
        return [];
      }
    },
    enabled: !!pickupLocation && !!pickupDate && !!returnDate,
  });
  
  // Fetch price trend prediction
  const { data: priceTrend } = useQuery({
    queryKey: ["price-trend", pickupLocation, carCategory, pickupDate],
    queryFn: async () => {
      if (!pickupLocation) return null;
      try {
        return await predictRentalPriceTrend(
          pickupLocation,
          format(pickupDate, "yyyy-MM-dd"),
          carCategory || "midsize"
        );
      } catch (error) {
        console.error("Error fetching price trend:", error);
        return null;
      }
    },
    enabled: !!pickupLocation && !!pickupDate,
  });
  
  // Fetch nearby rental locations
  const { data: nearbyLocations } = useQuery({
    queryKey: ["nearby-locations", pickupLocation],
    queryFn: async () => {
      if (!pickupLocation) return [];
      try {
        return await getNearbyRentalLocations(pickupLocation);
      } catch (error) {
        console.error("Error fetching nearby locations:", error);
        return [];
      }
    },
    enabled: !!pickupLocation,
  });
  
  // Handler to sort rental options
  const sortOptions = (options: RentalCarOption[], sortType: "price" | "rating") => {
    return [...options].sort((a, b) => {
      if (sortType === "price") {
        return a.totalPrice - b.totalPrice;
      } else {
        return b.rating - a.rating;
      }
    });
  };
  
  // Handle search submit
  const handleSearch = async () => {
    if (!pickupLocation) {
      toast.error("Please enter a pickup location");
      return;
    }
    
    if (!sameDropoff && !dropoffLocation) {
      toast.error("Please enter a drop-off location");
      return;
    }
    
    setIsSearching(true);
    try {
      await refetchRentals();
    } catch (error) {
      console.error("Error searching rentals:", error);
      toast.error("Could not find rental cars for this route");
    }
    setIsSearching(false);
  };
  
  // Handle sort change
  const handleSortChange = (value: "price" | "rating") => {
    setSortBy(value);
    if (rentalOptions.length > 0) {
      const sorted = sortOptions(rentalOptions, value);
      // In a real implementation, we would update the state here
    }
  };
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "EEE, MMM d");
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Find Rental Cars
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="search" className="w-1/2">Search</TabsTrigger>
              <TabsTrigger value="locations" className="w-1/2">Nearby Locations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4 pt-4">
              {/* Pickup Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Location</label>
                <LocationSearch
                  placeholder="Enter pickup location"
                  value={pickupLocation}
                  onChange={setPickupLocation}
                  onLocationSelect={setPickupCoords}
                />
              </div>
              
              {/* Same Dropoff Toggle */}
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="sameLocation" 
                  checked={sameDropoff}
                  onChange={(e) => setSameDropoff(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="sameLocation" className="text-sm">
                  Return to same location
                </label>
              </div>
              
              {/* Dropoff Location (if different) */}
              {!sameDropoff && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Drop-off Location</label>
                  <LocationSearch
                    placeholder="Enter drop-off location"
                    value={dropoffLocation}
                    onChange={setDropoffLocation}
                    onLocationSelect={setDropoffCoords}
                  />
                </div>
              )}
              
              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(pickupDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white">
                      <Calendar
                        mode="single"
                        selected={pickupDate}
                        onSelect={(date) => date && setPickupDate(date)}
                        disabled={(date) => date < today}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Return Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(returnDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={(date) => date && setReturnDate(date)}
                        disabled={(date) => date < pickupDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Filter Toggle */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleFilters}
                className="w-full flex items-center justify-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              
              {/* Filters Section */}
              {showFilters && (
                <div className="space-y-4 p-4 border rounded-md bg-white">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Car Type</label>
                    <Select value={carCategory} onValueChange={setCarCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any vehicle type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="">Any vehicle type</SelectItem>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="midsize">Midsize</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="minivan">Minivan</SelectItem>
                        <SelectItem value="convertible">Convertible</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select 
                      value={sortBy} 
                      onValueChange={(value) => handleSortChange(value as "price" | "rating")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="price">Lowest Price</SelectItem>
                        <SelectItem value="rating">Highest Rating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="w-full"
                disabled={isSearching || !pickupLocation || (!sameDropoff && !dropoffLocation)}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Car className="h-4 w-4 mr-2" />
                )}
                Search Rental Cars
              </Button>
              
              {/* Price Trend Indicator */}
              {priceTrend && (
                <div className={`
                  flex items-center gap-2 p-3 rounded-md
                  ${priceTrend.trend === 'rising' ? 'bg-red-50 text-red-700' : 
                    priceTrend.trend === 'falling' ? 'bg-green-50 text-green-700' : 
                    'bg-gray-50 text-gray-700'}
                `}>
                  {priceTrend.trend === 'rising' ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : priceTrend.trend === 'falling' ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <Minus className="h-5 w-5" />
                  )}
                  <p className="text-sm">{priceTrend.message}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="locations" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Find Locations Near</label>
                <LocationSearch
                  placeholder="Enter a city or location"
                  value={pickupLocation}
                  onChange={setPickupLocation}
                  onLocationSelect={setPickupCoords}
                />
              </div>
              
              {nearbyLocations && nearbyLocations.length > 0 ? (
                <div className="space-y-4 mt-4">
                  <h3 className="text-lg font-semibold">Rental Locations Near {pickupLocation}</h3>
                  {nearbyLocations.map(location => (
                    <RentalLocationCard key={location.id} location={location} />
                  ))}
                </div>
              ) : pickupLocation ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Finding locations...</p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MapPin className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Enter a location to find nearby rental places</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Results */}
          {isLoadingRentals ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : rentalOptions.length > 0 ? (
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {rentalOptions.length} vehicles available
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(pickupDate)} - {formatDate(returnDate)}
                </p>
              </div>
              
              {rentalOptions.map((option) => (
                <RentalCarCard key={option.id} rental={option} />
              ))}
            </div>
          ) : pickupLocation && !isLoadingRentals ? (
            <div className="p-8 text-center">
              <Car className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-600">No vehicles available</p>
              <p className="text-gray-500">Try different dates or location</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
