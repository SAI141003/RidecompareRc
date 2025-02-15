
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const RideCompare = () => {
  const features = [
    "Compare prices across all ride services",
    "Real-time pricing updates",
    "Exclusive discounts",
    "Priority customer support",
    "Advanced booking features",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-6">RideCompare Premium</h1>
        
        <Card className="bg-gray-900 p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Premium Membership</h2>
            <p className="text-gray-400 mt-2">Get the most out of RideCompare</p>
            <div className="text-3xl font-bold mt-4">$9.99/month</div>
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
