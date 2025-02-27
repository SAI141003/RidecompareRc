import type { RideOption } from "@/types/ride";
import { supabase } from "@/integrations/supabase/client";

const UBER_CLIENT_ID = import.meta.env.VITE_UBER_CLIENT_ID;
const LYFT_CLIENT_ID = import.meta.env.VITE_LYFT_CLIENT_ID;

export const fetchRideOptions = async (pickup: string, dropoff: string): Promise<RideOption[]> => {
  // First check if user has any connected providers
  const { data: providers } = await supabase
    .from('service_providers')
    .select('provider_type, access_token')
    .order('provider_type');

  // Base options array remains the same
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

  // If we have connected providers, fetch real prices
  if (providers && providers.length > 0) {
    const pricePromises = providers.map(async (provider) => {
      try {
        if (provider.provider_type === 'uber') {
          return await fetchUberPrices(provider.access_token, pickup, dropoff);
        } else if (provider.provider_type === 'lyft') {
          return await fetchLyftPrices(provider.access_token, pickup, dropoff);
        }
      } catch (error) {
        console.error(`Error fetching ${provider.provider_type} prices:`, error);
        return null;
      }
    });

    const realPrices = await Promise.all(pricePromises);

    // Update base options with real prices where available
    return baseOptions.map(option => {
      const realPrice = realPrices.find(prices => 
        prices?.provider === option.provider && prices?.type === option.type
      );

      if (realPrice) {
        return {
          ...option,
          price: realPrice.price,
          eta: realPrice.eta,
          surge: realPrice.surge,
        };
      }
      return option;
    });
  }

  return baseOptions;
};

// Function to initiate OAuth flow for ride providers
export const connectProvider = async (provider: 'uber' | 'lyft') => {
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to connect a provider');
  }

  // Configure OAuth settings based on provider
  const config = {
    uber: {
      clientId: UBER_CLIENT_ID,
      scope: 'profile rides.read',
      redirectUri: `${window.location.origin}/auth/callback/uber`,
    },
    lyft: {
      clientId: LYFT_CLIENT_ID,
      scope: 'public rides.read',
      redirectUri: `${window.location.origin}/auth/callback/lyft`,
    }
  };

  // Store the user ID in session storage for the callback
  sessionStorage.setItem('connecting_provider', provider);

  // Build the OAuth URL
  const providerConfig = config[provider];
  const oauthUrl = provider === 'uber'
    ? `https://login.uber.com/oauth/v2/authorize?client_id=${providerConfig.clientId}&response_type=code&scope=${providerConfig.scope}&redirect_uri=${providerConfig.redirectUri}`
    : `https://api.lyft.com/oauth/authorize?client_id=${providerConfig.clientId}&response_type=code&scope=${providerConfig.scope}&redirect_uri=${providerConfig.redirectUri}`;

  // Redirect to the OAuth login page
  window.location.href = oauthUrl;
};

// Function to handle OAuth callback
export const handleOAuthCallback = async (provider: 'uber' | 'lyft', code: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to complete provider connection');
  }

  // Exchange the authorization code for tokens using our edge function
  const response = await supabase.functions.invoke(`exchange-${provider}-token`, {
    body: { code, redirect_uri: `${window.location.origin}/auth/callback/${provider}` }
  });

  if (!response.data) {
    throw new Error(`Failed to exchange ${provider} authorization code`);
  }

  // Store the tokens in our database
  const { error } = await supabase
    .from('service_providers')
    .upsert({
      user_id: user.id,
      provider_type: provider,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: new Date(Date.now() + response.data.expires_in * 1000).toISOString(),
    }, {
      onConflict: 'user_id,provider_type'
    });

  if (error) {
    throw error;
  }

  return response.data;
};

// Helper function to fetch Uber prices
async function fetchUberPrices(accessToken: string, pickup: string, dropoff: string) {
  try {
    const response = await supabase.functions.invoke('fetch-uber-prices', {
      body: { accessToken, pickup, dropoff }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Uber prices:', error);
    return null;
  }
}

// Helper function to fetch Lyft prices
async function fetchLyftPrices(accessToken: string, pickup: string, dropoff: string) {
  try {
    const response = await supabase.functions.invoke('fetch-lyft-prices', {
      body: { accessToken, pickup, dropoff }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Lyft prices:', error);
    return null;
  }
}

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
