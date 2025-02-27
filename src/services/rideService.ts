
import type { RideOption } from "@/types/ride";
import { supabase } from "@/integrations/supabase/client";

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

// Helper function to generate slightly random prices
function generateRandomPrice(basePrice: number): number {
  const variation = basePrice * 0.2; // 20% variation
  const randomChange = (Math.random() - 0.5) * variation;
  return Number((basePrice + randomChange).toFixed(2));
}

// Helper function to generate slightly random ETAs
function generateRandomEta(baseEta: number): number {
  const variation = 2; // +/- 2 minutes
  const randomChange = Math.floor((Math.random() - 0.5) * variation * 2);
  return baseEta + randomChange;
}

// Function to initiate OAuth flow for ride providers (demo mode)
export const connectProvider = async (provider: 'uber' | 'lyft') => {
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to connect a provider');
  }

  // In demo mode, directly store a mock connection
  const { error } = await supabase
    .from('service_providers')
    .upsert({
      user_id: user.id,
      provider_type: provider,
      access_token: 'demo_token',
      refresh_token: 'demo_refresh_token',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    }, {
      onConflict: 'user_id,provider_type'
    });

  if (error) {
    throw error;
  }

  return { success: true };
};

// Function to disconnect a ride provider account
export const disconnectProvider = async (provider: 'uber' | 'lyft') => {
  // Get the current user's ID first
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to disconnect a provider');
  }

  const { error } = await supabase
    .from('service_providers')
    .delete()
    .eq('provider_type', provider)
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }
};

// Function to get connected providers for the current user
export const getConnectedProviders = async () => {
  // Get the current user's ID first
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to get connected providers');
  }

  const { data, error } = await supabase
    .from('service_providers')
    .select('provider_type, created_at')
    .eq('user_id', user.id)
    .order('provider_type');

  if (error) {
    throw error;
  }

  return data;
};
