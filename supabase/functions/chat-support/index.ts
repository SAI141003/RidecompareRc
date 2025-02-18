
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

    const rasaEndpoint = 'https://api.rasa.ai/api/v1/messages'
    const apiKey = Deno.env.get('RASA_API_KEY')

    if (!apiKey) {
      console.error('RASA_API_KEY not found')
      throw new Error('API key not configured')
    }

    console.log('Sending request to:', rasaEndpoint)
    
    const response = await fetch(rasaEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender_id: Date.now().toString(),
        message: message
      })
    })

    console.log('Response status:', response.status)
    const responseText = await response.text()
    console.log('Raw response:', responseText)

    if (!response.ok) {
      throw new Error(`Rasa API error: ${response.status} - ${responseText}`)
    }

    // Try to parse the response, with fallback for non-JSON responses
    let botResponse
    try {
      const parsed = JSON.parse(responseText)
      botResponse = parsed.message || parsed.text || responseText
    } catch (e) {
      console.log('Error parsing JSON response:', e)
      botResponse = responseText
    }

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
