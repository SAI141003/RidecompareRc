
import { Car } from "lucide-react";

interface RideOption {
  id: string;
  name: string;
  price: number;
  time: number;
  provider: "uber" | "lyft";
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
          className={`w-full p-4 rounded-xl border ${
            selectedId === option.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          } transition-colors`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">{option.name}</p>
                <p className="text-sm text-muted-foreground">
                  {option.time} mins away
                </p>
              </div>
            </div>
            <p className="font-semibold">${option.price.toFixed(2)}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RideOptions;
