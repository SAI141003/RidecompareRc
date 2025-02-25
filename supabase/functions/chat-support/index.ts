
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

    console.log('Sending message to Rasa:', message)

    // Make request to your local Rasa server (through ngrok)
    const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    
    // Extract the text from the first response
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
