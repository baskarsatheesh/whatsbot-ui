import { streamText } from 'ai'
import { NextRequest } from 'next/server'

// Get the whatsbot backend URL from environment variable
// Can be a full URL with path (e.g., https://example.com/chat/invoke) or base URL
const WHATSBOT_BACKEND_URL = process.env.WHATSBOT_BACKEND_URL || 'http://localhost:8000/chat/invoke'

// Normalize URL to remove double slashes and trailing slashes
function normalizeUrl(url: string): string {
  // Remove trailing slash
  url = url.replace(/\/+$/, '')
  // Replace multiple slashes with single slash (except after protocol)
  url = url.replace(/([^:]\/)\/+/g, '$1')
  return url
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Extract the last user message (backend expects a simple string input)
    const lastUserMessage = messages
      .filter((msg: { role: string; content: string }) => msg.role === 'user')
      .pop()?.content || ''

    if (!lastUserMessage) {
      throw new Error('No user message found')
    }

    // Normalize the URL to handle double slashes and other issues
    const backendUrl = normalizeUrl(WHATSBOT_BACKEND_URL)
    
    // Call the whatsbot backend API
    // Backend expects: {"input": "string"}
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: lastUserMessage,
      }),
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error('Backend API error:', errorText)
      throw new Error(`Backend API error: ${backendResponse.statusText}`)
    }

    // Check if the backend supports streaming
    const contentType = backendResponse.headers.get('content-type')
    const isStreaming = contentType?.includes('text/event-stream') || 
                       contentType?.includes('application/x-ndjson')

    if (isStreaming && backendResponse.body) {
      // If backend streams, pipe it through directly
      return new Response(backendResponse.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // If backend returns JSON, parse and stream it
    const data = await backendResponse.json()
    
    // Backend returns: {"output": "string", "metadata": {...}}
    const responseText = data.output || data.response || data.message || data.content || data.text || ''
    // Extract sources from metadata if available
    const sources = data.metadata?.sources || data.sources || data.references || []

    if (!responseText) {
      throw new Error('No response text received from backend')
    }

    // Stream the response in Vercel AI SDK format
    // Format: 0:"text chunk"\n
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Split response into words for smooth streaming
          const words = responseText.split(' ')
          for (let i = 0; i < words.length; i++) {
            const word = words[i]
            const space = i < words.length - 1 ? ' ' : ''
            // Vercel AI SDK format: 0:"chunk"\n
            const chunk = `0:${JSON.stringify(word + space)}\n`
            controller.enqueue(encoder.encode(chunk))
            // Small delay for smooth streaming effect
            await new Promise(resolve => setTimeout(resolve, 30))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    // Return the streamed response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

