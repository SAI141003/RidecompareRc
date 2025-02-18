
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RASA_ENDPOINT = 'https://api.rasa.ai/api/v1/messages'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log('Processing incoming message:', message)

    const RASA_API_KEY = Deno.env.get('RASA_API_KEY')
    if (!RASA_API_KEY) {
      console.error('RASA_API_KEY not found in environment variables')
      throw new Error('RASA_API_KEY is not configured')
    }

    console.log('Sending request to Rasa API...')
    const response = await fetch(RASA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RASA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender_id: 'web_user_' + Date.now(), // Unique sender ID for each request
        message: message,
        metadata: {
          channel: 'web',
          platform: 'ridecompare'
        }
      }),
    })

    console.log('Rasa API Response Status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Rasa API Error:', errorText)
      throw new Error(`Rasa API returned ${response.status}: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Rasa API Response:', responseData)

    // Extract the bot's response from Rasa's response format
    const botResponse = responseData.messages?.[0]?.text || 
                       responseData.text || 
                       responseData.message ||
                       "I apologize, but I'm having trouble understanding. Could you please rephrase that?"

    return new Response(
      JSON.stringify({ response: botResponse }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error in chat-support function:', error)
    
    // Send a more user-friendly error message while logging the full error
    return new Response(
      JSON.stringify({ 
        error: 'Sorry, I encountered an issue while processing your message. Please try again.',
        details: error.message
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
