'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import { AppShell } from '@/components/layout/AppShell'
import { ChatInput } from '@/components/chat/ChatInput'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { useStore, Message, Source } from '@/lib/store'

export default function ChatPage() {
  const {
    currentConversationId,
    createConversation,
    addMessage,
    setSources,
    messages: storeMessages,
    setCurrentConversation,
  } = useStore()

  const [currentSources, setCurrentSources] = useState<Source[]>([])

  const { messages: chatMessages, append, isLoading } = useChat({
    api: '/api/chat',
    onFinish: async (message) => {
      // Save the complete assistant message to store
      if (currentConversationId && message.role === 'assistant') {
        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: message.content,
          timestamp: new Date(),
        }
        addMessage(currentConversationId, assistantMessage)
        
        // Save sources if available
        if (currentSources.length > 0) {
          setSources(assistantMessage.id, currentSources)
        }
        setCurrentSources([])
      }
    },
    onResponse: async (response) => {
      // Try to extract sources from response headers or body
      // This is a placeholder - adjust based on your backend's response format
    },
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  // Sync user messages from useChat to store immediately
  useEffect(() => {
    if (!currentConversationId) return

    const storeConversationMessages = storeMessages[currentConversationId] || []

    chatMessages.forEach((msg) => {
      if (msg.role === 'user') {
        const exists = storeConversationMessages.some(
          (m) => m.role === 'user' && m.content === msg.content
        )
        
        if (!exists) {
          const userMessage: Message = {
            id: `msg-${Date.now()}-${Math.random()}`,
            role: 'user',
            content: msg.content,
            timestamp: new Date(),
          }
          addMessage(currentConversationId, userMessage)
        }
      }
    })
  }, [chatMessages, currentConversationId, storeMessages, addMessage])

  // Get streaming message content
  // Keep showing it even after loading finishes until it's saved to store
  const assistantChatMessages = chatMessages.filter(msg => msg.role === 'assistant')
  const lastAssistantChatMessage = assistantChatMessages[assistantChatMessages.length - 1]
  
  const storeAssistantMessages = currentConversationId
    ? storeMessages[currentConversationId]?.filter(msg => msg.role === 'assistant') || []
    : []
  const lastAssistantStoreMessage = storeAssistantMessages[storeAssistantMessages.length - 1]

  // Show streaming message if:
  // 1. Currently loading, OR
  // 2. We have more assistant messages in chat than in store (message not saved yet)
  const hasUnsavedMessage = assistantChatMessages.length > storeAssistantMessages.length
  const streamingMessage = (isLoading || hasUnsavedMessage) && lastAssistantChatMessage
    ? lastAssistantChatMessage.content
    : ''

  const handleSend = async (content: string) => {
    // Create conversation if needed
    let conversationId = currentConversationId
    if (!conversationId) {
      const title = content.slice(0, 50) || 'New Chat'
      conversationId = createConversation(title)
      setCurrentConversation(conversationId)
    }

    // Add user message to store immediately
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    addMessage(conversationId, userMessage)

    // Send to API
    await append({
      role: 'user',
      content,
    })
  }

  // Combine store messages with streaming message for display
  // Use store messages as base, but show streaming message if available
  const displayMessages: Message[] = currentConversationId
    ? storeMessages[currentConversationId] || []
    : []

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <ChatMessages
          messages={displayMessages}
          streamingMessage={streamingMessage}
        />
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </AppShell>
  )
}

