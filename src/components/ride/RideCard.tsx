
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, CarTaxiFront, TrendingUp } from "lucide-react";
import type { RideOption } from "@/types/ride";

interface RideCardProps {
  ride: RideOption;
  onBook: (ride: RideOption) => void;
}

export const RideCard = ({ ride, onBook }: RideCardProps) => {
  return (
    <Card className="bg-white/90">
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
            onClick={() => onBook(ride)}
            variant="outline"
            className="mt-2"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
