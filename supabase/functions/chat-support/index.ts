
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
    console.log('Received message:', message)

    if (!message) {
      throw new Error('No message provided')
    }

    const RASA_URL = Deno.env.get('RASA_URL')
    console.log('RASA_URL:', RASA_URL) // Debug log

    if (!RASA_URL) {
      console.error('RASA_URL is not set')
      return new Response(
        JSON.stringify({
          response: "I'm sorry, the chatbot is not properly configured yet."
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Ensure the URL ends with /webhooks/rest/webhook
    const webhookUrl = RASA_URL.endsWith('/webhooks/rest/webhook') 
      ? RASA_URL 
      : `${RASA_URL}${RASA_URL.endsWith('/') ? '' : '/'}webhooks/rest/webhook`

    console.log('Sending request to:', webhookUrl) // Debug log

    const rasaResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: "user",
        message: message
      })
    })

    if (!rasaResponse.ok) {
      console.error('Rasa error status:', rasaResponse.status)
      const errorText = await rasaResponse.text()
      console.error('Rasa error text:', errorText)
      throw new Error('Failed to get response from Rasa')
    }

    const rasaData = await rasaResponse.json()
    console.log('Rasa response data:', rasaData) // Debug log

    // Handle empty response from Rasa
    if (!Array.isArray(rasaData) || rasaData.length === 0) {
      return new Response(
        JSON.stringify({
          response: "I'm processing your request, but I'm not sure how to respond to that."
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Get the first response text
    const botResponse = rasaData[0]?.text || "I'm sorry, I couldn't understand that."

    return new Response(
      JSON.stringify({
        response: botResponse
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        response: "I'm sorry, I encountered an error while processing your request."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Changed to 200 to avoid frontend errors
      }
    )
  }
})
