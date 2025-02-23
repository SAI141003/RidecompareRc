
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Users, Building } from "lucide-react";
import { LocationSearch } from "@/components/LocationSearch";
import type { HotelSearchParams } from "@/types/hotel";

export const HotelSearch = () => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);

  const handleSearch = () => {
    const params: HotelSearchParams = {
      location,
      checkIn,
      checkOut,
      adults,
      rooms,
    };
    console.log("Searching hotels with params:", params);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Find Hotels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label>Location</Label>
            <LocationSearch
              placeholder="Where are you going?"
              value={location}
              onChange={setLocation}
              onLocationSelect={() => {}}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check-in</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Check-out</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Adults</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Rooms</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="1"
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            className="w-full"
          >
            Search Hotels
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
