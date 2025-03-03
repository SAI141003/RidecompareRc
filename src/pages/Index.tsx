
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { RideSearch } from "@/components/RideSearch";
import { HotelSearch } from "@/components/hotel/HotelSearch";
import { RentalCarSearch } from "@/components/rental/RentalCarSearch";
import { ConnectedAccounts } from "@/components/ride/ConnectedAccounts";
import { FeatureShowcase } from "@/components/common/FeatureShowcase";
import { TabToggle, TabOption } from "@/components/common/TabToggle";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabOption>('rides');
  const features = ["Google Flights", "DoorDash", "Skip", "Instacart"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-20">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8 animate-fade-up">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-white">RC</span>
          </div>
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to RideCompare
          </h1>
          <p className="text-sm text-gray-600 text-center max-w-sm">
            Your journey begins here. Find and book rides, rentals, and hotels with ease.
          </p>

          {activeTab === 'rides' && (
            <div className="w-full max-w-md">
              <ConnectedAccounts />
            </div>
          )}

          <TabToggle activeTab={activeTab} setActiveTab={setActiveTab} />
          <FeatureShowcase features={features} />
        </div>

        {activeTab === 'rides' ? (
          <RideSearch />
        ) : activeTab === 'hotels' ? (
          <HotelSearch />
        ) : (
          <RentalCarSearch />
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
