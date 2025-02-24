
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface RasaResponse {
  recipient_id: string;
  text: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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

    // Make request to local Rasa server
    const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
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
      throw new Error(`Rasa server error: ${response.statusText}`)
    }

    const rasaResponses: RasaResponse[] = await response.json()
    
    // Get the first response text or fallback to a default message
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
