
import Map from "@/components/Map";
import RideOptions from "@/components/RideOptions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SearchResultsProps {
  selectedRide: string | undefined;
  setSelectedRide: (id: string) => void;
  mockRideOptions: Array<{
    id: string;
    name: string;
    price: number;
    time: number;
    provider: "uber" | "lyft";
    capacity: number;
    type: "economy" | "premium" | "luxury";
    eta: number;
    surge?: number;
  }>;
}

export const SearchResults = ({
  selectedRide,
  setSelectedRide,
  mockRideOptions,
}: SearchResultsProps) => {
  const handleBookRide = () => {
    const selectedOption = mockRideOptions.find(option => option.id === selectedRide);
    if (selectedOption) {
      // Determine which app to open based on the provider
      let appUrl = '';
      if (selectedOption.provider === 'uber') {
        // Uber deep linking
        appUrl = 'https://m.uber.com/ul';
      } else if (selectedOption.provider === 'lyft') {
        // Lyft deep linking
        appUrl = 'https://lyft.com/ride';
      }

      // Open the respective app or website
      window.open(appUrl, '_blank');
      toast.success(`Redirecting to ${selectedOption.provider.toUpperCase()}`);
    }
  };

  return (
    <div className="mt-8 space-y-6 fade-up opacity-0">
      <Map />
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Available Rides</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Best Value</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Surge Pricing</span>
            </div>
          </div>
        </div>
        <RideOptions
          options={mockRideOptions}
          onSelect={(option) => setSelectedRide(option.id)}
          selectedId={selectedRide}
        />
        {selectedRide && (
          <Button 
            className="w-full mt-4 py-6 text-base font-semibold"
            onClick={handleBookRide}
          >
            Book Ride
          </Button>
        )}
      </div>
    </div>
  );
};
