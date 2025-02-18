
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const RASA_API_KEY = Deno.env.get('RASA_API_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    // Call Rasa API
    const response = await fetch('https://api.rasa.com/v1/webhooks/rest/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RASA_API_KEY}`,
      },
      body: JSON.stringify({ 
        sender: "user",
        message: message 
      }),
    })

    if (!response.ok) {
      throw new Error(`Rasa API error: ${response.statusText}`)
    }

    const rasaResponse = await response.json()
    console.log('Rasa response:', rasaResponse)

    // Extract the text from Rasa's response
    const botMessage = rasaResponse[0]?.text || "I'm sorry, I couldn't process that request."

    return new Response(
      JSON.stringify({ response: botMessage }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
