
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface PricePredictionRequest {
  location_from: string;
  location_to: string;
  day_of_week?: number;
  hour_of_day?: number;
}

interface GeocodingResult {
  lat: number;
  lon: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to get coordinates from location string using OpenStreetMap Nominatim API
async function getCoordinates(location: string): Promise<GeocodingResult> {
  const encodedLocation = encodeURIComponent(location);
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1`,
    {
      headers: {
        'User-Agent': 'RideShareApp/1.0',
      },
    }
  );
  const data = await response.json();
  
  if (!data || data.length === 0) {
    throw new Error(`Could not geocode location: ${location}`);
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in miles
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location_from, location_to, day_of_week, hour_of_day } = await req.json() as PricePredictionRequest;
    
    // Get coordinates for both locations
    const fromCoords = await getCoordinates(location_from);
    const toCoords = await getCoordinates(location_to);

    // Calculate actual distance
    const distance = calculateDistance(
      fromCoords.lat, fromCoords.lon,
      toCoords.lat, toCoords.lon
    );

    // Get current time components if not provided
    const now = new Date();
    const currentDayOfWeek = day_of_week ?? now.getDay();
    const currentHourOfDay = hour_of_day ?? now.getHours();

    // Pricing factors
    const basePrice = 5.00;
    const perMileRate = 2.50;
    const perMinuteRate = 0.50;
    const serviceFee = 2.00;

    // Estimate duration based on distance (assuming average speed of 30 mph)
    const averageSpeed = 30; // mph
    const estimatedDuration = Math.ceil((distance / averageSpeed) * 60); // Convert to minutes

    // Calculate surge based on time and distance
    const isPeakHour = (currentHourOfDay >= 7 && currentHourOfDay <= 9) || 
                      (currentHourOfDay >= 16 && currentHourOfDay <= 19);
    const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6;
    
    let surgeMultiplier = 1.0;
    if (isPeakHour) surgeMultiplier *= 1.5;
    if (isWeekend) surgeMultiplier *= 1.2;
    // Additional surge for longer distances
    if (distance > 20) surgeMultiplier *= 1.1;

    // Calculate final price
    const distanceCharge = distance * perMileRate;
    const timeCharge = estimatedDuration * perMinuteRate;
    const subtotal = (basePrice + distanceCharge + timeCharge) * surgeMultiplier;
    const predictedPrice = subtotal + serviceFee;

    console.log('Price prediction calculation:', {
      location_from,
      location_to,
      distance,
      estimatedDuration,
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
