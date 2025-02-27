
import { supabase } from "@/integrations/supabase/client";

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
