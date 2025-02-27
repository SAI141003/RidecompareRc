
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

    const response = await fetch('https://api.lyft.com/v1/cost', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
      body: JSON.stringify({
        start_lat: pickupCoords.lat,
        start_lng: pickupCoords.lng,
        end_lat: dropoffCoords.lat,
        end_lng: dropoffCoords.lng,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || 'Failed to fetch Lyft prices');
    }

    // Transform the response to match our RideOption format
    const transformedData = data.cost_estimates.map((estimate: any) => ({
      provider: 'lyft',
      type: estimate.ride_type,
      price: estimate.estimated_cost_cents_max / 100,
      eta: estimate.estimated_duration_seconds / 60,
      surge: estimate.primetime_percentage > 0,
    }));

    return new Response(JSON.stringify(transformedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Lyft prices:', error);
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
