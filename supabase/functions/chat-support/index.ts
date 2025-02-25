
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

    // Get the RASA URL from environment variable
    const RASA_URL = Deno.env.get('RASA_URL')
    if (!RASA_URL) {
      throw new Error('RASA_URL environment variable is not set')
    }

    // Remove trailing slash if present
    const baseUrl = RASA_URL.endsWith('/') ? RASA_URL.slice(0, -1) : RASA_URL
    const webhookUrl = `${baseUrl}/webhooks/rest/webhook`
    
    console.log('Sending message to Rasa:', message)
    console.log('Using Rasa webhook URL:', webhookUrl)

    try {
      const response = await fetch(webhookUrl, {
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
        const errorText = await response.text()
        console.error('Rasa server error:', errorText)
        throw new Error(`Rasa server error: ${response.status} ${response.statusText}`)
      }

      const rasaResponses = await response.json()
      console.log('Rasa response:', rasaResponses)
      
      if (!Array.isArray(rasaResponses) || rasaResponses.length === 0) {
        throw new Error('Invalid response format from Rasa server')
      }

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
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      throw new Error(`Failed to communicate with Rasa server: ${fetchError.message}`)
    }

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
