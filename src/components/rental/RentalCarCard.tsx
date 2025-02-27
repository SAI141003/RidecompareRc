
import React, { useState } from "react";
import { 
  Car, 
  Users, 
  Calendar, 
  Check,
  Star,
  DollarSign,
  MapPin,
  AlertCircle,
  ArrowUpRight,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { RentalCarOption } from "@/services/rentalCarService";
import { generateDeepLink } from "@/services/rentalCarService";
import { toast } from "sonner";

interface RentalCarCardProps {
  rental: RentalCarOption;
}

export const RentalCarCard = ({ rental }: RentalCarCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleBooking = () => {
    const deepLink = generateDeepLink(rental);
    window.open(deepLink, "_blank");
    toast.success(`Redirecting to ${rental.provider.toUpperCase()}`);
  };

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      enterprise: "bg-green-600",
      hertz: "bg-yellow-500",
      avis: "bg-red-600",
      budget: "bg-orange-500",
      turo: "bg-blue-600",
      sixt: "bg-black"
    };
    return colors[provider] || "bg-gray-600";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4 flex flex-col md:flex-row">
        {/* Provider and Car Info */}
        <div className="flex items-center space-x-4 flex-1">
          <div className={`p-3 rounded-full ${getProviderColor(rental.provider)}`}>
            <Car className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold">{rental.model}</h3>
              {rental.special && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  Special Offer
                </Badge>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Badge variant="secondary" className="mr-2">
                {rental.provider.charAt(0).toUpperCase() + rental.provider.slice(1)}
              </Badge>
              
              <span className="flex items-center">
                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                {rental.rating.toFixed(1)}
              </span>
              
              <span className="mx-2">•</span>
              
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {rental.category === "minivan" ? "7" : 
                 rental.category === "suv" ? "5" : 
                 rental.category === "compact" || rental.category === "economy" ? "4" : "5"} seats
              </span>
              
              <span className="mx-2">•</span>
              
              <span className="capitalize">{rental.category}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mt-1 flex-wrap">
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {rental.location}
              </span>
              
              <span className="mx-2">•</span>
              
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(rental.pickupDate)} to {formatDate(rental.returnDate)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Price and Book Button */}
        <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end justify-between">
          <div className="text-right">
            <p className="text-lg font-bold">${rental.totalPrice.toFixed(2)}</p>
            <p className="text-xs text-gray-500">${rental.price.toFixed(2)}/day × {rental.duration} days</p>
          </div>
          
          <div className="flex space-x-2 mt-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{rental.model}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Provider</span>
                    <span className="capitalize">{rental.provider}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Total Price</span>
                    <span className="font-bold">${rental.totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Rental Period</span>
                    <span>{formatDate(rental.pickupDate)} - {formatDate(rental.returnDate)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Mileage</span>
                    <span>
                      {rental.unlimited_mileage ? 
                        "Unlimited" : 
                        `${rental.mileage_limit} miles/day`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="font-medium">Deposit</span>
                    <span>
                      {rental.deposit_required ? 
                        `$${rental.deposit_amount}` : 
                        "No deposit required"}
                    </span>
                  </div>
                  
                  <div className="pb-2 border-b">
                    <p className="font-medium mb-2">Included Features</p>
                    <div className="grid grid-cols-2 gap-2">
                      {rental.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {rental.special && (
                    <div className="bg-green-50 p-3 rounded-md flex items-start">
                      <AlertCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-green-700 text-sm">{rental.special}</p>
                    </div>
                  )}
                  
                  <Button onClick={() => {
                    handleBooking();
                    setIsDialogOpen(false);
                  }} className="w-full">
                    Book with {rental.provider.charAt(0).toUpperCase() + rental.provider.slice(1)}
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button size="sm" onClick={handleBooking}>
              Book Now
            </Button>
          </div>
        </div>
      </div>
      
      {/* Special Offer Banner */}
      {rental.special && (
        <div className="bg-green-50 p-2 text-center text-sm text-green-700 border-t border-green-100">
          <p className="font-medium">{rental.special}</p>
        </div>
      )}
    </Card>
  );
};
