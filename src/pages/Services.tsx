
import { Header } from "@/components/Header";
import { 
  Search, Navigation, MapPin
} from "lucide-react";

const Services = () => {
  const transportServices = [
    { icon: <Search className="h-6 w-6 text-primary" />, name: "Compare Rides" },
    { icon: <Navigation className="h-6 w-6 text-primary" />, name: "Track Rides" },
    { icon: <MapPin className="h-6 w-6 text-primary" />, name: "Smart Routes" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Services</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Go anywhere</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {transportServices.map((service, index) => (
              <div key={index} className="relative service-card">
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
