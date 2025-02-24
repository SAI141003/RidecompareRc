
import { supabase } from "@/integrations/supabase/client";

export const getPricePrediction = async (
  location_from: string,
  location_to: string,
  day_of_week?: number,
  hour_of_day?: number
) => {
  console.log('Fetching price prediction for:', { location_from, location_to });
  
  const { data, error } = await supabase.functions.invoke('predict-ride-price', {
    body: {
      location_from,
      location_to,
      day_of_week,
      hour_of_day,
    },
  });

  if (error) {
    console.error('Price prediction error:', error);
    throw error;
  }

  console.log('Price prediction response:', data);
  return data;
};

export const checkFraudRisk = async (
  action_type: string,
  details: Record<string, unknown>
) => {
  const { data, error } = await supabase.functions.invoke('detect-fraud', {
    body: {
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action_type,
      details,
    },
  });

  if (error) throw error;
  return data;
};
