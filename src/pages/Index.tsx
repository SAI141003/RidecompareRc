
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { SearchResults } from "@/components/SearchResults";
import { Features } from "@/components/Features";
import { toast } from "sonner";

const mockRideOptions = [
  {
    id: "1",
    name: "UberX",
    price: 25.50,
    time: 4,
    provider: "uber" as const,
    capacity: 4,
    type: "economy" as const,
    eta: 12,
  },
  {
    id: "2",
    name: "Lyft",
    price: 23.75,
    time: 5,
    provider: "lyft" as const,
    capacity: 4,
    type: "economy" as const,
    eta: 15,
    surge: 1.2,
  },
  {
    id: "3",
    name: "Uber Black",
    price: 45.00,
    time: 6,
    provider: "uber" as const,
    capacity: 4,
    type: "luxury" as const,
    eta: 8,
  },
  {
    id: "4",
    name: "Lyft Lux",
    price: 42.50,
    time: 7,
    provider: "lyft" as const,
    capacity: 4,
    type: "luxury" as const,
    eta: 10,
  },
  {
    id: "5",
    name: "UberXL",
    price: 35.75,
    time: 8,
    provider: "uber" as const,
    capacity: 6,
    type: "premium" as const,
    eta: 14,
  },
  {
    id: "6",
    name: "Lyft XL",
    price: 34.25,
    time: 9,
    provider: "lyft" as const,
    capacity: 6,
    type: "premium" as const,
    eta: 16,
  },
];

const Index = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedRide, setSelectedRide] = useState<string>();
  const [showResults, setShowResults] = useState(false);

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
      <Header />

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

            <SearchForm
              pickup={pickup}
              setPickup={setPickup}
              dropoff={dropoff}
              setDropoff={setDropoff}
              onSearch={handleSearch}
            />

            {showResults && (
              <SearchResults
                selectedRide={selectedRide}
                setSelectedRide={setSelectedRide}
                mockRideOptions={mockRideOptions}
              />
            )}
          </div>
        </div>
      </section>

      <Features />
    </div>
  );
};

export default Index;
