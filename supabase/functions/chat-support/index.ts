
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    // Simple response logic
    let response = "I'm sorry, I'm a simple bot for now. I understand you said: " + message;

    // Add some basic responses
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      response = "Hello! How can I help you today?";
    } else if (message.toLowerCase().includes('help')) {
      response = "I'm here to help! What do you need assistance with?";
    } else if (message.toLowerCase().includes('bye')) {
      response = "Goodbye! Have a great day!";
    }

    return new Response(
      JSON.stringify({ response }),
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
