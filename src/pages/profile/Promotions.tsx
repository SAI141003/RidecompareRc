
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift } from "lucide-react";

const Promotions = () => {
  const promotions = [
    {
      code: "RIDE10",
      description: "Get 10% off your next ride",
      expiry: "2024-03-31",
    },
    {
      code: "WELCOME",
      description: "New user discount: $5 off",
      expiry: "2024-12-31",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">RideCompare Promotions</h1>
        
        <div className="grid gap-4">
          {promotions.map((promo, index) => (
            <Card key={index} className="bg-white p-6 shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">{promo.description}</h3>
                  </div>
                  <p className="text-sm text-gray-600">Code: {promo.code}</p>
                  <p className="text-sm text-gray-600">Expires: {promo.expiry}</p>
                </div>
                <Button variant="outline">
                  Apply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promotions;
