'use client'

import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

export function HistorySidebar() {
  const {
    conversations,
    currentConversationId,
    setCurrentConversation,
    createConversation,
    clearCurrentConversation,
    deleteConversation,
  } = useStore()

  const handleNewChat = () => {
    clearCurrentConversation()
  }

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id)
  }

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteConversation(id)
  }

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <div className="border-b p-4">
        <Button
          onClick={handleNewChat}
          className="w-full"
          variant="default"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No conversations yet. Start a new chat to begin.
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={cn(
                  'group relative flex items-center justify-between rounded-lg p-3 text-sm cursor-pointer transition-colors hover:bg-accent',
                  currentConversationId === conv.id && 'bg-accent'
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{conv.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(conv.lastUpdated, { addSuffix: true })}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

