
import { Button } from "@/components/ui/button";

export type TabOption = 'rides' | 'hotels' | 'rentals';

interface TabToggleProps {
  activeTab: TabOption;
  setActiveTab: (tab: TabOption) => void;
}

export const TabToggle = ({ activeTab, setActiveTab }: TabToggleProps) => {
  return (
    <div className="flex space-x-4">
      <Button
        variant={activeTab === 'rides' ? 'default' : 'outline'}
        onClick={() => setActiveTab('rides')}
      >
        Rides
      </Button>
      <Button
        variant={activeTab === 'rentals' ? 'default' : 'outline'}
        onClick={() => setActiveTab('rentals')}
      >
        Rentals
      </Button>
      <Button
        variant={activeTab === 'hotels' ? 'default' : 'outline'}
        onClick={() => setActiveTab('hotels')}
      >
        Hotels
      </Button>
    </div>
  );
};
