
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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

    if (!message) {
      throw new Error('No message provided')
    }

    const RASA_API_KEY = Deno.env.get('RASA_API_KEY')
    if (!RASA_API_KEY) {
      throw new Error('RASA API key not configured')
    }

    // Make request to your Rasa server
    const response = await fetch('https://38d7-81-28-156-126.ngrok-free.app/webhooks/rest/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RASA_API_KEY}`
      },
      body: JSON.stringify({
        sender: "user",
        message: message
      })
    })

    if (!response.ok) {
      console.error('Rasa server error:', await response.text())
      throw new Error(`Rasa server error: ${response.statusText}`)
    }

    const rasaResponses = await response.json()
    console.log('Rasa response:', rasaResponses)
    
    const botResponse = rasaResponses[0]?.text || "I'm sorry, I couldn't process that request."

    return new Response(
      JSON.stringify({
        response: botResponse
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
