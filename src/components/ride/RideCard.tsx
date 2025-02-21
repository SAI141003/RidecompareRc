
import { Share2, Car, Clock, Users, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { RideOption } from "@/types/ride";

interface RideCardProps {
  ride: RideOption;
  onBook: (ride: RideOption) => void;
}

export const RideCard = ({ ride, onBook }: RideCardProps) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${ride.provider.toUpperCase()} Ride`,
          text: `Check out this ${ride.provider} ride from ${ride.pickup_location} to ${ride.dropoff_location}. Price: $${ride.price}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        const shareText = `${ride.provider.toUpperCase()} Ride from ${ride.pickup_location} to ${ride.dropoff_location}. Price: $${ride.price}`;
        await navigator.clipboard.writeText(shareText);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Failed to share ride");
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-xl border transition-all duration-200",
        ride.selected
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-border hover:border-primary/50 hover:shadow-md"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-12 w-12 rounded-lg flex items-center justify-center",
              ride.provider === "uber" ? "bg-black text-white" : "bg-[#FF00BF] text-white"
            )}
          >
            <Car className="h-6 w-6" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="font-medium">{ride.name}</p>
              {ride.surge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                  Surge pricing
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{ride.time} mins away</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{ride.capacity}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="h-3 w-3" />
                <span>{ride.eta} mins</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">${ride.price.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground capitalize">{ride.type}</p>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Button 
          className="flex-1"
          onClick={() => onBook(ride)}
        >
          Book Now
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          title="Share this ride"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
