
import { serve } from "https://deno.fresh.run/x/server@0.201.1";
import { supabaseClient } from "../_shared/supabase-client.ts";

interface FraudDetectionRequest {
  user_id: string;
  action_type: string;
  details: Record<string, unknown>;
}

serve(async (req) => {
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
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ status: 'ok' }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
