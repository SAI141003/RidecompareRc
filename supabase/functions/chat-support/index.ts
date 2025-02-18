
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

    const rasaUrl = Deno.env.get('RASA_URL')
    const apiKey = Deno.env.get('RASA_API_KEY')

    if (!rasaUrl) {
      console.error('RASA_URL not found')
      throw new Error('Rasa URL not configured')
    }

    if (!apiKey) {
      console.error('RASA_API_KEY not found')
      throw new Error('API key not configured')
    }

    const rasaEndpoint = `${rasaUrl}/webhooks/rest/webhook`
    console.log('Sending request to:', rasaEndpoint)
    
    const response = await fetch(rasaEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: Date.now().toString(),
        message: message
      })
    })

    console.log('Response status:', response.status)
    const responseText = await response.text()
    console.log('Raw response:', responseText)

    if (!response.ok) {
      throw new Error(`Rasa API error: ${response.status} - ${responseText}`)
    }

    let botResponse
    try {
      const parsed = JSON.parse(responseText)
      // Rasa webhook responses are typically arrays
      if (Array.isArray(parsed) && parsed.length > 0) {
        botResponse = parsed[0].text || "I couldn't process that request."
      } else {
        botResponse = parsed.message || parsed.text || "I couldn't process that request."
      }
    } catch (e) {
      console.log('Error parsing JSON response:', e)
      botResponse = "Sorry, I encountered an error processing your request."
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
