
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log('Processing incoming message:', message)

    const rasaApiKey = Deno.env.get('RASA_API_KEY')
    if (!rasaApiKey) {
      throw new Error('RASA API key not configured')
    }

    // Make request to local Rasa server
    const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rasaApiKey}`
      },
      body: JSON.stringify({
        sender: "user",
        message: message
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RASA API Error:', errorText);
      throw new Error(`RASA API error: ${response.status}`);
    }

    const data = await response.json();
    // RASA returns an array of responses, we'll take the first one
    const botResponse = data[0]?.text || "I'm sorry, I couldn't understand that.";

    return new Response(
      JSON.stringify({ response: botResponse }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Chat support error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process message',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
