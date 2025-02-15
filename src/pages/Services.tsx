
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Car, Package, Key, Calendar, UserMinus, Bus, Users, 
  UtensilsCrossed, ShoppingBag, Wine, Mouse, Clock
} from "lucide-react";

const Services = () => {
  const transportServices = [
    { icon: <Car className="w-8 h-8" />, name: "Ride", promo: true },
    { icon: <Package className="w-8 h-8" />, name: "Courier", promo: true },
    { icon: <Key className="w-8 h-8" />, name: "Rental Cars" },
    { icon: <Calendar className="w-8 h-8" />, name: "Reserve" },
    { icon: <UserMinus className="w-8 h-8" />, name: "Teens" },
    { icon: <Bus className="w-8 h-8" />, name: "Transit" },
    { icon: <Users className="w-8 h-8" />, name: "Group Ride" },
  ];

  const deliveryServices = [
    { icon: <UtensilsCrossed className="w-8 h-8" />, name: "Food", promo: true },
    { icon: <ShoppingBag className="w-8 h-8" />, name: "Grocery", promo: true },
    { icon: <Wine className="w-8 h-8" />, name: "Alcohol", promo: true },
    { icon: <Mouse className="w-8 h-8" />, name: "Electronics" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Services</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Go anywhere</h2>
          <Card className="bg-secondary p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Reserve a ride in advance</h3>
                <Button variant="secondary" className="bg-card hover:bg-card/80">
                  Request Reserve
                </Button>
              </div>
              <Clock className="w-16 h-16 text-muted-foreground" />
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {transportServices.map((service, index) => (
              <div key={index} className="relative service-card">
                {service.promo && <span className="promo-badge">Promo</span>}
                {service.icon}
                <span className="text-sm">{service.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Get anything delivered</h2>
          <div className="grid grid-cols-4 gap-4">
            {deliveryServices.map((service, index) => (
              <div key={index} className="relative service-card">
                {service.promo && <span className="promo-badge">Promo</span>}
                {service.icon}
                <span className="text-sm">{service.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;
