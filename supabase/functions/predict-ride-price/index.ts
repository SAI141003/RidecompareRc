
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface PricePredictionRequest {
  location_from: string;
  location_to: string;
  day_of_week?: number;
  hour_of_day?: number;
}

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location_from, location_to, day_of_week, hour_of_day } = await req.json() as PricePredictionRequest;
    
    // Get current time components if not provided
    const now = new Date();
    const currentDayOfWeek = day_of_week ?? now.getDay();
    const currentHourOfDay = hour_of_day ?? now.getHours();

    // Base pricing calculation
    const basePrice = 5.00; // Base fare
    const perMileRate = 2.50; // Rate per mile
    const perMinuteRate = 0.50; // Rate per minute
    const serviceFee = 2.00; // Fixed service fee

    // Mock distance calculation (in miles) - in production this would use real mapping data
    const distance = 5; // Example fixed distance for demo

    // Estimate trip duration (in minutes) - in production this would use real traffic data
    const estimatedDuration = 15;

    // Calculate time-based surge multiplier
    const isPeakHour = (currentHourOfDay >= 7 && currentHourOfDay <= 9) || 
                      (currentHourOfDay >= 16 && currentHourOfDay <= 19);
    const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6;
    
    let surgeMultiplier = 1.0;
    if (isPeakHour) surgeMultiplier *= 1.5;
    if (isWeekend) surgeMultiplier *= 1.2;

    // Calculate predicted price
    const distanceCharge = distance * perMileRate;
    const timeCharge = estimatedDuration * perMinuteRate;
    const subtotal = (basePrice + distanceCharge + timeCharge) * surgeMultiplier;
    const predictedPrice = subtotal + serviceFee;

    // Calculate confidence score based on time of day and historical data
    const confidenceScore = isPeakHour ? 0.85 : 0.95;

    // Store prediction in database
    const { error } = await supabaseClient
      .from('price_predictions')
      .insert({
        location_from,
        location_to,
        predicted_price: predictedPrice,
        confidence_score: confidenceScore,
        day_of_week: currentDayOfWeek,
        hour_of_day: currentHourOfDay,
      });

    if (error) throw error;

    // Log the prediction details
    console.log({
      location_from,
      location_to,
      predicted_price: predictedPrice,
      confidence_score: confidenceScore,
      surge_multiplier: surgeMultiplier,
      is_peak_hour: isPeakHour,
      is_weekend: isWeekend,
    });

    return new Response(
      JSON.stringify({
        predicted_price: predictedPrice,
        confidence_score: confidenceScore,
        details: {
          base_fare: basePrice,
          distance_charge: distanceCharge,
          time_charge: timeCharge,
          service_fee: serviceFee,
          surge_multiplier: surgeMultiplier,
          estimated_duration: estimatedDuration,
          estimated_distance: distance,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Price prediction error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
