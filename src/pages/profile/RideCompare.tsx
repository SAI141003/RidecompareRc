
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RideCompare = () => {
  const navigate = useNavigate();
  const features = [
    "Compare prices across all ride services",
    "Real-time pricing updates",
    "Exclusive discounts",
    "Priority customer support",
    "Advanced booking features",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">RideCompare Premium</h1>
        </div>
        
        <Card className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Premium Membership</h2>
            <p className="text-muted-foreground mt-2">Get the most out of RideCompare</p>
            <div className="text-3xl font-bold mt-4">$2.00/month</div>
          </div>

          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button className="w-full">
            Upgrade to Premium
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default RideCompare;
