'use client'

import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { Message } from '@/lib/store'

interface ChatMessagesProps {
  messages: Message[]
  streamingMessage?: string
}

export function ChatMessages({ messages, streamingMessage }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 && !streamingMessage && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Ask anything...</h2>
            <p className="text-muted-foreground">
              Start a conversation by typing a message below
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
        
        {streamingMessage && (
          <MessageBubble
            role="assistant"
            content={streamingMessage}
            isStreaming={true}
          />
        )}
      </div>
      
      <div ref={messagesEndRef} />
    </div>
  )
}

