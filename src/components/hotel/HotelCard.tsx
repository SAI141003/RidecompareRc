
import { Hotel } from "@/types/hotel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

export const HotelCard = ({ hotel, onSelect }: HotelCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={hotel.image || "/placeholder.svg"}
          alt={hotel.name}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">{hotel.rating}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{hotel.distance}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">
              {hotel.currency} {hotel.price}
            </span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
          <Button onClick={() => onSelect(hotel)}>View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};
