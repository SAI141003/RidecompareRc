
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { accessToken, pickup, dropoff } = await req.json();

    // First get coordinates from locations
    const pickupCoords = await getCoordinates(pickup);
    const dropoffCoords = await getCoordinates(dropoff);

    const response = await fetch('https://api.uber.com/v1.2/estimates/price', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      body: JSON.stringify({
        start_latitude: pickupCoords.lat,
        start_longitude: pickupCoords.lng,
        end_latitude: dropoffCoords.lat,
        end_longitude: dropoffCoords.lng,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch Uber prices');
    }

    // Transform the response to match our RideOption format
    const transformedData = data.prices.map((price: any) => ({
      provider: 'uber',
      type: price.localized_display_name,
      price: price.high_estimate,
      eta: price.duration,
      surge: price.surge_multiplier > 1,
    }));

    return new Response(JSON.stringify(transformedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Uber prices:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getCoordinates(address: string) {
  // You would typically use a geocoding service here
  // For this example, we'll return mock coordinates
  return {
    lat: 37.7749,
    lng: -122.4194,
  };
}
