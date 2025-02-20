
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
  importance: number;
  distance?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getCoordinates(location: string): Promise<GeocodingResult> {
  try {
    const encodedLocation = encodeURIComponent(location);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1&addressdetails=1`,
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
    console.log('Geocoding response:', data);

    if (!data || data.length === 0) {
      throw new Error(`No results found for location: ${location}`);
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      importance: parseFloat(data[0].importance || 0)
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to geocode location: ${location}`);
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c;
  console.log('Calculated distance:', distance);
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location_from, location_to, day_of_week, hour_of_day } = await req.json() as PricePredictionRequest;
    console.log('Received request:', { location_from, location_to, day_of_week, hour_of_day });

    // Get coordinates
    const fromCoords = await getCoordinates(location_from);
    const toCoords = await getCoordinates(location_to);
    console.log('Coordinates:', { fromCoords, toCoords });

    // Calculate distance
    const distance = calculateDistance(
      fromCoords.lat, fromCoords.lon,
      toCoords.lat, toCoords.lon
    );

    // Dynamic pricing factors
    const basePrice = 5.00; // Base fare
    const perMileRate = 2.50; // Per mile rate
    const perMinuteRate = 0.50; // Per minute rate
    const serviceFee = 2.00; // Service fee

    // Traffic and speed adjustments based on time of day
    const now = new Date();
    const currentHour = hour_of_day ?? now.getHours();
    const currentDay = day_of_week ?? now.getDay();
    
    // Adjust average speed based on time of day
    let averageSpeed = 30; // Base speed in mph
    if (currentHour >= 7 && currentHour <= 9) averageSpeed = 20; // Morning rush
    else if (currentHour >= 16 && currentHour <= 18) averageSpeed = 15; // Evening rush
    else if (currentHour >= 22 || currentHour <= 5) averageSpeed = 35; // Night time

    // Calculate estimated duration
    const estimatedDuration = Math.max(10, Math.ceil((distance / averageSpeed) * 60));

    // Dynamic surge calculation
    let surgeMultiplier = 1.0;
    
    // Time-based surge
    const isPeakHour = (currentHour >= 7 && currentHour <= 9) || 
                      (currentHour >= 16 && currentHour <= 19);
    const isWeekend = currentDay === 0 || currentDay === 6;
    
    if (isPeakHour) surgeMultiplier *= 1.5;
    if (isWeekend) surgeMultiplier *= 1.2;
    
    // Distance-based surge
    if (distance > 20) surgeMultiplier *= 1.1;
    if (distance > 50) surgeMultiplier *= 1.2;

    // Calculate components
    const distanceCharge = distance * perMileRate;
    const timeCharge = estimatedDuration * perMinuteRate;
    const subtotal = (basePrice + distanceCharge + timeCharge) * surgeMultiplier;
    const finalPrice = subtotal + serviceFee;

    const priceDetails = {
      base_fare: basePrice,
      distance_charge: Math.round(distanceCharge * 100) / 100,
      time_charge: Math.round(timeCharge * 100) / 100,
      service_fee: serviceFee,
      surge_multiplier: Math.round(surgeMultiplier * 100) / 100,
      estimated_duration: estimatedDuration,
      estimated_distance: distance,
      average_speed: averageSpeed
    };

    console.log('Price calculation details:', priceDetails);

    return new Response(
      JSON.stringify({
        predicted_price: Math.round(finalPrice * 100) / 100,
        confidence_score: 0.95,
        details: priceDetails
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    console.error('Price prediction error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
