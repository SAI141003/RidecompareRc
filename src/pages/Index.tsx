
import { MapPin, Navigation, Search, LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map";
import RideOptions from "@/components/RideOptions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const mockRideOptions = [
  {
    id: "1",
    name: "UberX",
    price: 25.50,
    time: 4,
    provider: "uber" as const,
  },
  {
    id: "2",
    name: "Lyft",
    price: 23.75,
    time: 5,
    provider: "lyft" as const,
  },
  {
    id: "3",
    name: "Uber Black",
    price: 45.00,
    time: 6,
    provider: "uber" as const,
  },
];

const Index = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedRide, setSelectedRide] = useState<string>();
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      toast.error("Error logging out");
    }
  };

  const handleSearch = () => {
    if (!pickup || !dropoff) {
      toast.error("Please enter both pickup and dropoff locations");
      return;
    }
    setShowResults(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-up");
        }
      });
    });

    document.querySelectorAll(".fade-up").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2"
        >
          <UserCircle className="h-4 w-4" />
          Profile
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <section className="relative min-h-screen flex items-center justify-center hero-pattern overflow-hidden pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 fade-up opacity-0 mb-12">
              <span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/5 text-primary rounded-full animate-fade-in">
                Compare and Save
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Find the best ride at the
                <span className="block text-primary">best price</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Compare prices across multiple ride-sharing services instantly
              </p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4 fade-up opacity-0">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background"
                />
              </div>
              
              <div className="relative">
                <Navigation className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter destination"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background"
                />
              </div>

              <Button 
                className="w-full py-6 rounded-xl text-base font-semibold"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-5 w-5" />
                Compare Rides
              </Button>
            </div>

            {showResults && (
              <div className="mt-8 space-y-6 fade-up opacity-0">
                <Map />
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Available Rides</h2>
                  <RideOptions
                    options={mockRideOptions}
                    onSelect={(option) => setSelectedRide(option.id)}
                    selectedId={selectedRide}
                  />
                  {selectedRide && (
                    <Button className="w-full mt-4">Book Ride</Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-up opacity-0">
            <h2 className="text-3xl font-bold">Why Choose RideCompare?</h2>
            <p className="mt-4 text-muted-foreground">
              Compare prices and find the best ride for your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="fade-up opacity-0 glass rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    title: "Best Prices",
    description: "Compare prices across multiple ride-sharing services in real-time.",
    icon: <Search className="h-6 w-6 text-primary" />,
  },
  {
    title: "Real-Time ETAs",
    description: "Get accurate arrival times and track your ride in real-time.",
    icon: <Navigation className="h-6 w-6 text-primary" />,
  },
  {
    title: "Smart Routes",
    description: "AI-powered route suggestions for the best travel experience.",
    icon: <MapPin className="h-6 w-6 text-primary" />,
  },
];

export default Index;
