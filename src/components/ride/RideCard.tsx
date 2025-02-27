
import { RideOption } from "@/types/ride";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Clock, Users, Timer } from "lucide-react";

interface RideCardProps {
  ride: RideOption;
  onBook: (ride: RideOption) => void;
}

export const RideCard = ({ ride, onBook }: RideCardProps) => {
  const isPromo = ride.name.includes('(Promo)');

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-full ${ride.provider === 'uber' ? 'bg-black' : 'bg-pink-600'}`}>
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              {ride.name}
              {isPromo && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  Connected Account
                </span>
              )}
            </h3>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {ride.eta} min wait
              </span>
              <span className="flex items-center">
                <Timer className="h-4 w-4 mr-1" />
                {ride.time} min travel
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {ride.capacity}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            ${ride.price.toFixed(2)}
          </div>
          <Button
            size="sm"
            onClick={() => onBook(ride)}
            className="mt-2"
          >
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
};
