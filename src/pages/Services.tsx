
import { Header } from "@/components/Header";
import { 
  Search, Navigation, MapPin, Car, Clock, Shield,
  Banknote, Route, Heart, AlertTriangle, Share2, Bike
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const Services = () => {
  const compareServices = [
    { 
      icon: <Car className="h-6 w-6 text-primary" />, 
      name: "Ride Compare",
      description: "Compare prices across multiple ride services"
    },
    { 
      icon: <Clock className="h-6 w-6 text-primary" />, 
      name: "Wait Times",
      description: "Check estimated arrival times for each service"
    },
    { 
      icon: <Banknote className="h-6 w-6 text-primary" />, 
      name: "Price Alerts",
      description: "Get notified when prices drop"
    }
  ];

  const safetyServices = [
    { 
      icon: <Shield className="h-6 w-6 text-primary" />, 
      name: "Safety Features",
      description: "Track rides and share your journey"
    },
    { 
      icon: <Route className="h-6 w-6 text-primary" />, 
      name: "Route Preview",
      description: "See your route before booking"
    },
    { 
      icon: <AlertTriangle className="h-6 w-6 text-primary" />, 
      name: "Emergency Support",
      description: "24/7 customer service"
    }
  ];

  const additionalServices = [
    { 
      icon: <Share2 className="h-6 w-6 text-primary" />, 
      name: "Split Fare",
      description: "Share ride costs with friends"
    },
    { 
      icon: <Heart className="h-6 w-6 text-primary" />, 
      name: "Favorite Routes",
      description: "Save your frequent trips"
    },
    { 
      icon: <Bike className="h-6 w-6 text-primary" />, 
      name: "Multi-mode",
      description: "Compare bikes, scooters, and cars"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <h1 className="text-3xl font-bold mb-6">Our Services</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Compare & Save</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {compareServices.map((service, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Safety First</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {safetyServices.map((service, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Additional Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default Services;
