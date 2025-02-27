
import type { RideOption } from "@/types/ride";
import { supabase } from "@/integrations/supabase/client";
import { generateRandomPrice, generateRandomEta } from "./priceService";
export { connectProvider, disconnectProvider, getConnectedProviders } from "./providerService";

export const fetchRideOptions = async (pickup: string, dropoff: string): Promise<RideOption[]> => {
  // First check if user has any connected providers
  const { data: providers } = await supabase
    .from('service_providers')
    .select('provider_type, access_token')
    .order('provider_type');

  // Base options array
  const baseOptions: RideOption[] = [
    {
      id: "uber-x",
      provider: "uber" as const,
      type: "UberX",
      name: "UberX",
      capacity: 4,
      price: generateRandomPrice(15.99),
      eta: generateRandomEta(5),
      time: 3,
      surge: Math.random() > 0.7, // 30% chance of surge
      pickup_location: pickup,
      dropoff_location: dropoff
    },
    {
      id: "uber-xl",
      provider: "uber" as const, 
      type: "UberXL",
      name: "UberXL",
      capacity: 6,
      price: generateRandomPrice(25.99),
      eta: generateRandomEta(8),
      time: 5,
      surge: Math.random() > 0.8, // 20% chance of surge
      pickup_location: pickup,
      dropoff_location: dropoff
    },
    {
      id: "lyft-standard",
      provider: "lyft" as const,
      type: "Lyft",
      name: "Lyft Standard",
      capacity: 4,
      price: generateRandomPrice(14.99),
      eta: generateRandomEta(4),
      time: 2,
      surge: Math.random() > 0.7, // 30% chance of surge
      pickup_location: pickup,
      dropoff_location: dropoff
    },
    {
      id: "lyft-xl",
      provider: "lyft" as const,
      type: "Lyft XL",
      name: "Lyft XL",
      capacity: 6,
      price: generateRandomPrice(24.99),
      eta: generateRandomEta(7),
      time: 4,
      surge: Math.random() > 0.8, // 20% chance of surge
      pickup_location: pickup,
      dropoff_location: dropoff
    },
  ];

  // If provider is connected, show a "Connected Account" tag but still use demo data
  if (providers && providers.length > 0) {
    return baseOptions.map(option => {
      const isProviderConnected = providers.some(p => p.provider_type === option.provider);
      if (isProviderConnected) {
        return {
          ...option,
          name: `${option.name} (Connected Account)`,
        };
      }
      return option;
    });
  }

  return baseOptions;
};
