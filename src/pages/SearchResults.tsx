import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchResults } from "@/components/SearchResults";
import { useState } from "react";
import type { RideOption } from "@/types/ride";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const pickup = searchParams.get("pickup") || "";
  const dropoff = searchParams.get("dropoff") || "";
  const [selectedRide, setSelectedRide] = useState<string>();

  // Mock ride options for demonstration
  const mockRideOptions = [
    {
      id: "uber-x",
      name: "UberX",
      price: 25.99,
      time: 5,
      provider: "uber" as const,
      capacity: 4,
      type: "economy" as const,
      eta: 5,
    },
    {
      id: "uber-black",
      name: "Uber Black",
      price: 45.99,
      time: 8,
      provider: "uber" as const,
      capacity: 4,
      type: "luxury" as const,
      eta: 7,
      surge: 1.5,
    },
    {
      id: "lyft-standard",
      name: "Lyft",
      price: 24.99,
      time: 4,
      provider: "lyft" as const,
      capacity: 4,
      type: "economy" as const,
      eta: 3,
    },
  ];

  if (!pickup || !dropoff) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-2xl font-bold mb-2">Available Rides</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{pickup}</span>
            <span>→</span>
            <span>{dropoff}</span>
          </div>
        </div>
        
        <SearchResults
          selectedRide={selectedRide}
          setSelectedRide={setSelectedRide}
          mockRideOptions={mockRideOptions}
        />
      </main>
    </div>
  );
};

export default SearchResultsPage;
