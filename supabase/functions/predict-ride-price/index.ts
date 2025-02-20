
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface PricePredictionRequest {
  location_from: string;
  location_to: string;
  day_of_week?: number;
  hour_of_day?: number;
}

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

    // Pricing factors
    const basePrice = 5.00;
    const perMileRate = 2.50;
    const perMinuteRate = 0.50;
    const serviceFee = 2.00;

    // Mock distance (5 miles) and duration (15 minutes) for demo
    const distance = 5;
    const estimatedDuration = 15;

    // Calculate surge based on time
    const isPeakHour = (currentHourOfDay >= 7 && currentHourOfDay <= 9) || 
                      (currentHourOfDay >= 16 && currentHourOfDay <= 19);
    const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6;
    
    let surgeMultiplier = 1.0;
    if (isPeakHour) surgeMultiplier *= 1.5;
    if (isWeekend) surgeMultiplier *= 1.2;

    // Calculate final price
    const distanceCharge = distance * perMileRate;
    const timeCharge = estimatedDuration * perMinuteRate;
    const subtotal = (basePrice + distanceCharge + timeCharge) * surgeMultiplier;
    const predictedPrice = subtotal + serviceFee;

    console.log('Price prediction calculation:', {
      location_from,
      location_to,
      basePrice,
      distanceCharge,
      timeCharge,
      surgeMultiplier,
      predictedPrice,
    });

    return new Response(
      JSON.stringify({
        predicted_price: predictedPrice,
        confidence_score: 0.95,
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
