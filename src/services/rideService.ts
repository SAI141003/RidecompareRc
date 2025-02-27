
import type { RideOption } from "@/types/ride";
import { supabase } from "@/integrations/supabase/client";

export const fetchRideOptions = async (pickup: string, dropoff: string): Promise<RideOption[]> => {
  // First check if user has any connected providers
  const { data: providers } = await supabase
    .from('service_providers')
    .select('provider_type, access_token')
    .order('provider_type');

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Base prices that will be adjusted based on connected accounts
  const baseOptions: RideOption[] = [
    {
      id: "uber-x",
      provider: "uber" as const,
      type: "UberX",
      name: "UberX",
      capacity: 4,
      price: 15.99,
      eta: 5,
      time: 3,
      surge: false,
      pickup_location: pickup,
      dropoff_location: dropoff
    },
    {
      id: "uber-xl",
      provider: "uber" as const, 
      type: "UberXL",
      name: "UberXL",
      capacity: 6,
      price: 25.99,
      eta: 8,
      time: 5,
      surge: false,
      pickup_location: pickup,
      dropoff_location: dropoff
    },
    {
      id: "lyft-standard",
      provider: "lyft" as const,
      type: "Lyft",
      name: "Lyft Standard",
      capacity: 4,
      price: 14.99,
      eta: 4,
      time: 2,
      surge: false,
      pickup_location: pickup,
      dropoff_location: dropoff
    },
    {
      id: "lyft-xl",
      provider: "lyft" as const,
      type: "Lyft XL",
      name: "Lyft XL",
      capacity: 6,
      price: 24.99,
      eta: 7,
      time: 4,
      surge: false,
      pickup_location: pickup,
      dropoff_location: dropoff
    },
  ];

  // Apply promotional prices for connected accounts
  return baseOptions.map(option => {
    const connectedProvider = providers?.find(p => p.provider_type === option.provider);
    if (connectedProvider) {
      // Apply a promotional discount (in a real app, this would come from the provider's API)
      return {
        ...option,
        price: option.price * 0.85, // 15% discount for connected accounts
        name: `${option.name} (Promo)`,
      };
    }
    return option;
  });
};

// Function to connect a ride provider account
export const connectProvider = async (provider: 'uber' | 'lyft') => {
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to connect a provider');
  }

  // In a real implementation, this would redirect to the provider's OAuth flow
  const mockToken = {
    access_token: `mock_${provider}_token_${Date.now()}`,
    refresh_token: `mock_${provider}_refresh_${Date.now()}`,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Convert Date to ISO string
  };

  const { data, error } = await supabase
    .from('service_providers')
    .upsert({
      user_id: user.id,
      provider_type: provider,
      access_token: mockToken.access_token,
      refresh_token: mockToken.refresh_token,
      expires_at: mockToken.expires_at,
    }, {
      onConflict: 'user_id,provider_type'
    });

  if (error) {
    throw error;
  }

  return data;
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

