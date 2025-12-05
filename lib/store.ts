import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Source {
  id: string
  title: string
  url: string
  snippet: string
}

export interface Conversation {
  id: string
  title: string
  lastUpdated: Date
}

interface AppState {
  // Conversations
  conversations: Conversation[]
  currentConversationId: string | null
  
  // Messages: conversationId -> messages[]
  messages: Record<string, Message[]>
  
  // Sources: messageId -> sources[]
  sources: Record<string, Source[]>
  
  // Actions
  createConversation: (title: string) => string
  setCurrentConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Message) => void
  setSources: (messageId: string, sources: Source[]) => void
  deleteConversation: (id: string) => void
  clearCurrentConversation: () => void
}

export const useStore = create<AppState>((set) => ({
  conversations: [],
  currentConversationId: null,
  messages: {},
  sources: {},
  
  createConversation: (title: string) => {
    const id = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const conversation: Conversation = {
      id,
      title,
      lastUpdated: new Date(),
    }
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      currentConversationId: id,
      messages: { ...state.messages, [id]: [] },
    }))
    return id
  },
  
  setCurrentConversation: (id: string | null) => {
    set({ currentConversationId: id })
  },
  
  addMessage: (conversationId: string, message: Message) => {
    set((state) => {
      const existingMessages = state.messages[conversationId] || []
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existingMessages, message],
        },
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, lastUpdated: new Date() }
            : conv
        ),
      }
    })
  },
  
  setSources: (messageId: string, sources: Source[]) => {
    set((state) => ({
      sources: {
        ...state.sources,
        [messageId]: sources,
      },
    }))
  },
  
  deleteConversation: (id: string) => {
    set((state) => {
      const { [id]: _, ...messages } = state.messages
      const { [id]: __, ...sources } = state.sources
      return {
        conversations: state.conversations.filter((conv) => conv.id !== id),
        messages,
        sources,
        currentConversationId:
          state.currentConversationId === id ? null : state.currentConversationId,
      }
    })
  },
  
  clearCurrentConversation: () => {
    set({ currentConversationId: null })
  },
}))

