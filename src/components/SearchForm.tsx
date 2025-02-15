
import { MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SearchFormProps {
  pickup: string;
  setPickup: (value: string) => void;
  dropoff: string;
  setDropoff: (value: string) => void;
  onSearch: () => void;
}

export const SearchForm = ({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  onSearch,
}: SearchFormProps) => {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      toast.error("Please enter both pickup and dropoff locations");
      return;
    }
    navigate(`/search?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`);
  };

  return (
    <form onSubmit={handleSearch} className="glass rounded-2xl p-6 space-y-4 fade-up opacity-0">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Enter pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background"
        />
      </div>
      
      <div className="relative">
        <Navigation className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Enter destination"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background"
        />
      </div>

      <Button 
        type="submit"
        className="w-full py-6 rounded-xl text-base font-semibold"
      >
        <Search className="mr-2 h-5 w-5" />
        Compare Rides
      </Button>
    </form>
  );
};
