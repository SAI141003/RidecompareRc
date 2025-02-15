
import Map from "@/components/Map";
import RideOptions from "@/components/RideOptions";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  selectedRide: string | undefined;
  setSelectedRide: (id: string) => void;
  mockRideOptions: Array<{
    id: string;
    name: string;
    price: number;
    time: number;
    provider: "uber" | "lyft";
  }>;
}

export const SearchResults = ({
  selectedRide,
  setSelectedRide,
  mockRideOptions,
}: SearchResultsProps) => {
  return (
    <div className="mt-8 space-y-6 fade-up opacity-0">
      <Map />
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Available Rides</h2>
        <RideOptions
          options={mockRideOptions}
          onSelect={(option) => setSelectedRide(option.id)}
          selectedId={selectedRide}
        />
        {selectedRide && (
          <Button className="w-full mt-4">Book Ride</Button>
        )}
      </div>
    </div>
  );
};
