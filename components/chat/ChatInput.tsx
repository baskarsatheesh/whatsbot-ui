'use client'

import { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className={cn(
                "min-h-[60px] max-h-[200px] resize-none pr-12",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
              rows={1}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

