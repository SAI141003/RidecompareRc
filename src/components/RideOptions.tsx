
import { Car, Clock, Gauge, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface RideOption {
  id: string;
  name: string;
  price: number;
  time: number;
  provider: "uber" | "lyft";
  capacity: number;
  surge?: number;
  type: "economy" | "premium" | "luxury";
  eta: number;
}

interface RideOptionsProps {
  options: RideOption[];
  onSelect: (option: RideOption) => void;
  selectedId?: string;
}

const RideOptions = ({ options, onSelect, selectedId }: RideOptionsProps) => {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option)}
          className={cn(
            "w-full p-4 rounded-xl border transition-all duration-200",
            selectedId === option.id
              ? "border-primary bg-primary/5 shadow-lg"
              : "border-border hover:border-primary/50 hover:shadow-md"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center",
                option.provider === "uber" ? "bg-black text-white" : "bg-[#FF00BF] text-white"
              )}>
                <Car className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{option.name}</p>
                  {option.surge && option.surge > 1 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      {option.surge}x surge
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{option.time} mins away</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{option.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge className="h-3 w-3" />
                    <span>{option.eta} mins</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg">${option.price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground capitalize">{option.type}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RideOptions;
