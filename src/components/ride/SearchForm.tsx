
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";

interface SearchFormProps {
  pickup: string;
  setPickup: (value: string) => void;
  dropoff: string;
  setDropoff: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export const SearchForm = ({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  onSearch,
  isSearching,
}: SearchFormProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Dropoff Location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button
        onClick={onSearch}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        disabled={isSearching}
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Search Rides"
        )}
      </Button>
    </div>
  );
};
