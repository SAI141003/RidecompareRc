
import { Card } from "@/components/ui/card";
import { MapPin, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RentalLocationProps {
  location: {
    id: string;
    name: string;
    address: string;
    distance: number;
    providers: string[];
  };
}

export const RentalLocationCard = ({ location }: RentalLocationProps) => {
  // Format provider name with proper capitalization
  const formatProviderName = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
          <MapPin className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold">{location.name}</h3>
          <p className="text-sm text-gray-500">{location.address}</p>
          
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-500 mr-2">
              {location.distance.toFixed(1)} miles away
            </span>
            
            <div className="flex flex-wrap gap-1">
              {location.providers.map((provider) => (
                <Badge 
                  key={provider} 
                  variant="outline"
                  className="text-xs"
                >
                  <Car className="h-3 w-3 mr-1" />
                  {formatProviderName(provider)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
