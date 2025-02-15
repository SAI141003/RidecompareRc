
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface FraudDetectionRequest {
  user_id: string;
  action_type: string;
  details: Record<string, unknown>;
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
    const { user_id, action_type, details } = await req.json() as FraudDetectionRequest;

    // Simple fraud detection logic (should be replaced with ML model)
    const isSuspicious = details.amount && Number(details.amount) > 1000;
    
    if (isSuspicious) {
      const { error } = await supabaseClient
        .from('fraud_detection_logs')
        .insert({
          user_id,
          incident_type: action_type,
          severity: 1,
          details,
          is_resolved: false,
        });

      if (error) throw error;

      return new Response(
        JSON.stringify({ 
          status: 'suspicious',
          message: 'Suspicious activity detected',
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ status: 'ok' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
