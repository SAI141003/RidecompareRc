
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, Navigation, MapPin, Clock, Rocket, Package,
  UserMinus, Bus, Users, UtensilsCrossed, ShoppingBag, Wine
} from "lucide-react";

const Services = () => {
  const transportServices = [
    { icon: <Search className="h-6 w-6 text-primary" />, name: "Compare Rides", promo: true },
    { icon: <Navigation className="h-6 w-6 text-primary" />, name: "Track Rides", promo: true },
    { icon: <MapPin className="h-6 w-6 text-primary" />, name: "Smart Routes" },
    { icon: <Clock className="h-6 w-6 text-primary" />, name: "Schedule" },
    { icon: <UserMinus className="h-6 w-6 text-primary" />, name: "Teens" },
    { icon: <Bus className="h-6 w-6 text-primary" />, name: "Transit" },
    { icon: <Users className="h-6 w-6 text-primary" />, name: "Group Ride" },
  ];

  const deliveryServices = [
    { icon: <UtensilsCrossed className="h-6 w-6 text-primary" />, name: "Food", promo: true },
    { icon: <ShoppingBag className="h-6 w-6 text-primary" />, name: "Grocery", promo: true },
    { icon: <Wine className="h-6 w-6 text-primary" />, name: "Alcohol", promo: true },
    { icon: <Package className="h-6 w-6 text-primary" />, name: "Electronics" },
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
              <Rocket className="w-16 h-16 text-primary" />
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {transportServices.map((service, index) => (
              <div key={index} className="relative service-card">
                {service.promo && <span className="promo-badge">Promo</span>}
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
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
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
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
