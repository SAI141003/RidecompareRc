import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Users, Building, Search, Loader2 } from "lucide-react";
import { LocationSearch } from "@/components/LocationSearch";
import type { Hotel, HotelSearchParams } from "@/types/hotel";
import { searchHotels } from "@/services/hotelService";
import { HotelCard } from "./HotelCard";
import { toast } from "sonner";
import { HotelDetailsDialog } from "./HotelDetailsDialog";

export const HotelSearch = () => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const params: HotelSearchParams = {
        location,
        checkIn,
        checkOut,
        adults,
        rooms,
      };
      const results = await searchHotels(params);
      setHotels(results);
    } catch (error) {
      toast.error("Failed to search hotels. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <Card className="relative overflow-hidden bg-white/90 backdrop-blur-lg shadow-xl border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Find Your Perfect Stay
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Location</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <LocationSearch
                  placeholder="Where are you going?"
                  value={location}
                  onChange={setLocation}
                  onLocationSelect={() => {}}
                  className="pl-10 bg-background/50 backdrop-blur-sm focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Check-in</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-10 bg-background/50 backdrop-blur-sm focus:bg-background transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Check-out</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-10 bg-background/50 backdrop-blur-sm focus:bg-background transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Adults</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="pl-10 bg-background/50 backdrop-blur-sm focus:bg-background transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Rooms</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="pl-10 bg-background/50 backdrop-blur-sm focus:bg-background transition-colors"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search Hotels"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hotels.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onSelect={handleHotelSelect}
            />
          ))}
        </div>
      )}

      <HotelDetailsDialog
        hotel={selectedHotel}
        isOpen={!!selectedHotel}
        onClose={() => setSelectedHotel(null)}
      />
    </div>
  );
};
