
import { serve } from "https://deno.fresh.run/x/server@0.201.1";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface PricePredictionRequest {
  location_from: string;
  location_to: string;
  day_of_week?: number;
  hour_of_day?: number;
}

serve(async (req) => {
  try {
    const { location_from, location_to, day_of_week, hour_of_day } = await req.json() as PricePredictionRequest;
    
    // Get current time components if not provided
    const now = new Date();
    const currentDayOfWeek = day_of_week ?? now.getDay();
    const currentHourOfDay = hour_of_day ?? now.getHours();

    // Simple price prediction logic (this should be replaced with ML model)
    const basePrice = 20;
    const distanceMultiplier = 1.5;
    const timeMultiplier = currentHourOfDay >= 17 && currentHourOfDay <= 19 ? 1.3 : 1;
    const weekendMultiplier = currentDayOfWeek === 0 || currentDayOfWeek === 6 ? 1.2 : 1;

    const predictedPrice = basePrice * distanceMultiplier * timeMultiplier * weekendMultiplier;
    const confidenceScore = 0.85;

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

    return new Response(
      JSON.stringify({
        predicted_price: predictedPrice,
        confidence_score: confidenceScore,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
