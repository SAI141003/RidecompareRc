
import { RideSearch } from "@/components/RideSearch";
import { Header } from "@/components/Header";
import { Plane, Utensils, ShoppingCart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-6 mb-12 animate-fade-up">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-xl flex items-center justify-center">
            <span className="text-4xl font-bold text-white">RC</span>
          </div>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to RideCompare
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-md">
            Your journey begins here. Find and book rides to your destination with ease.
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="mb-12 p-6 glass rounded-2xl animate-fade-up">
          <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            New Features Coming Soon!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 glass rounded-xl">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Plane className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Flight Comparison</h3>
                <p className="text-sm text-gray-600">Google Flights integration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 glass rounded-xl">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Utensils className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Food Delivery</h3>
                <p className="text-sm text-gray-600">Uber Eats, DoorDash, Skip</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 glass rounded-xl">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Grocery Delivery</h3>
                <p className="text-sm text-gray-600">Instacart integration</p>
              </div>
            </div>
          </div>
        </div>

        <RideSearch />
      </main>
    </div>
  );
};

export default Index;
