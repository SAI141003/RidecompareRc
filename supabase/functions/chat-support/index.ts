
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log('Received message:', message)

    const RASA_API_KEY = Deno.env.get('RASA_API_KEY')
    if (!RASA_API_KEY) {
      throw new Error('RASA_API_KEY is not configured')
    }

    // Call Rasa API with the correct endpoint and format
    const response = await fetch('https://api.rasa.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RASA_API_KEY}`,
      },
      body: JSON.stringify({ 
        message: message,
        sender: "web_user"
      }),
    })

    console.log('Rasa API Response Status:', response.status)
    const responseText = await response.text()
    console.log('Rasa API Raw Response:', responseText)

    if (!response.ok) {
      const errorMessage = `Rasa API error: ${response.status} - ${responseText}`
      console.error(errorMessage)
      throw new Error(errorMessage)
    }

    let botMessage
    try {
      const rasaResponse = JSON.parse(responseText)
      // Handle the response format as per Rasa's documentation
      botMessage = rasaResponse.text || rasaResponse.message || "I'm sorry, I couldn't process that request."
    } catch (e) {
      console.error('Error parsing Rasa response:', e)
      botMessage = "I'm sorry, there was an error processing your request."
    }

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
    console.error('Error in chat-support function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'An error occurred while processing your request'
      }),
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
