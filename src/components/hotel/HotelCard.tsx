
import { Hotel } from "@/types/hotel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Wifi, Coffee, Utensils, DoorClosed } from "lucide-react";

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

export const HotelCard = ({ hotel, onSelect }: HotelCardProps) => {
  const amenityIcons: Record<string, React.ComponentType> = {
    "Free WiFi": Wifi,
    "Restaurant": Utensils,
    "Room Service": DoorClosed,
    "Coffee": Coffee,
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={hotel.image || "/placeholder.svg"}
          alt={hotel.name}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg tracking-tight line-clamp-1">
              {hotel.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">{hotel.distance}</span>
            </div>
          </div>
          <div className="flex items-center px-2 py-1 bg-yellow-50 rounded-full">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-yellow-700">
              {hotel.rating}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 3).map((amenity, index) => {
            const Icon = amenityIcons[amenity] || Coffee;
            return (
              <div
                key={index}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
              >
                <Icon className="h-3 w-3" />
                <span>{amenity}</span>
              </div>
            );
          })}
          {hotel.amenities.length > 3 && (
            <div className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground">
              +{hotel.amenities.length - 3} more
            </div>
          )}
        </div>
        <div className="pt-4 border-t flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {hotel.currency} {hotel.price}
            </div>
            <div className="text-sm text-muted-foreground">/night</div>
          </div>
          <Button 
            onClick={() => onSelect(hotel)}
            className="relative overflow-hidden group/button"
          >
            <span className="relative z-10">View Details</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
