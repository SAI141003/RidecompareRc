
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

async function getCoordinates(location: string) {
  try {
    const encodedLocation = encodeURIComponent(location);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'RideShareApp/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Geocoding response for:', location, data);

    if (!data || data.length === 0) {
      throw new Error(`No results found for location: ${location}`);
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const deltaLat = (lat2 - lat1) * Math.PI / 180;
  const deltaLon = (lon2 - lon1) * Math.PI / 180;

  const a = 
    Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
    Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  console.log('Distance calculation:', {
    from: { lat: lat1, lon: lon1 },
    to: { lat: lat2, lon: lon2 },
    distance: distance
  });
  
  return Math.max(0.1, Math.round(distance * 100) / 100); // Minimum 0.1 miles
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request:', await req.text());
    const { location_from, location_to, day_of_week, hour_of_day } = await req.json() as PricePredictionRequest;

    // Get coordinates
    const fromCoords = await getCoordinates(location_from);
    const toCoords = await getCoordinates(location_to);

    // Calculate actual distance
    const distance = calculateDistance(
      fromCoords.lat, fromCoords.lon,
      toCoords.lat, toCoords.lon
    );

    // Base pricing
    const basePrice = 5.00;
    const perMileRate = 2.50;
    const perMinuteRate = 0.50;
    const serviceFee = 2.00;

    // Calculate duration (assuming average speed of 30 mph)
    const averageSpeed = 30;
    const estimatedDuration = Math.max(10, Math.ceil((distance / averageSpeed) * 60));

    // Calculate surge multiplier
    const now = new Date();
    const currentHour = hour_of_day ?? now.getHours();
    const currentDay = day_of_week ?? now.getDay();
    
    let surgeMultiplier = 1.0;
    
    // Peak hours surge
    if ((currentHour >= 7 && currentHour <= 9) || (currentHour >= 16 && currentHour <= 19)) {
      surgeMultiplier *= 1.5;
    }
    
    // Weekend surge
    if (currentDay === 0 || currentDay === 6) {
      surgeMultiplier *= 1.2;
    }
    
    // Long distance surge
    if (distance > 20) surgeMultiplier *= 1.1;

    // Calculate price components
    const distanceCharge = distance * perMileRate;
    const timeCharge = estimatedDuration * perMinuteRate;
    const subtotal = (basePrice + distanceCharge + timeCharge) * surgeMultiplier;
    const finalPrice = subtotal + serviceFee;

    const response = {
      predicted_price: Math.round(finalPrice * 100) / 100,
      confidence_score: 0.95,
      details: {
        base_fare: basePrice,
        distance_charge: Math.round(distanceCharge * 100) / 100,
        time_charge: Math.round(timeCharge * 100) / 100,
        service_fee: serviceFee,
        surge_multiplier: Math.round(surgeMultiplier * 100) / 100,
        estimated_duration: estimatedDuration,
        estimated_distance: distance,
      }
    };

    console.log('Final calculation:', response);

    return new Response(
      JSON.stringify(response),
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
