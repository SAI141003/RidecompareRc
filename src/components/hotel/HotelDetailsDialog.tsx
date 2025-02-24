
import { Hotel } from "@/types/hotel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Calendar, Users, BuildingIcon, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface HotelDetailsDialogProps {
  hotel: Hotel | null;
  onClose: () => void;
  isOpen: boolean;
}

export const HotelDetailsDialog = ({ hotel, onClose, isOpen }: HotelDetailsDialogProps) => {
  const [isBooking, setIsBooking] = useState(false);

  if (!hotel) return null;

  const handleBookNow = async () => {
    setIsBooking(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Booking confirmed! Check your email for details.");
      onClose();
    } catch (error) {
      toast.error("Failed to complete booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden bg-white/90 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{hotel.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="aspect-[16/9] overflow-hidden rounded-lg">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{hotel.distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{hotel.rating} rating</span>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {hotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-secondary/50 backdrop-blur-sm space-y-4">
                <div className="text-3xl font-bold">
                  {hotel.currency} {hotel.price}
                  <span className="text-sm text-muted-foreground font-normal"> /night</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">4 nights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">2 adults</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4" />
                    <span className="text-sm">1 room</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Total</span>
                    <span className="font-bold">
                      {hotel.currency} {(hotel.price * 4).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleBookNow}
                disabled={isBooking}
              >
                {isBooking ? "Confirming..." : "Book Now"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
