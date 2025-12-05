'use client'

import { useStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { useMemo } from 'react'

export function SourcePanel() {
  const { messages, sources, currentConversationId } = useStore()

  const currentSources = useMemo(() => {
    if (!currentConversationId) return []
    
    const conversationMessages = messages[currentConversationId] || []
    const lastAssistantMessage = [...conversationMessages]
      .reverse()
      .find((msg) => msg.role === 'assistant')
    
    if (!lastAssistantMessage) return []
    
    return sources[lastAssistantMessage.id] || []
  }, [messages, sources, currentConversationId])

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Sources</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {currentSources.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              Sources will appear here when available
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {currentSources.map((source) => (
              <Card key={source.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm line-clamp-2">
                    {source.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs line-clamp-2 mb-3">
                    {source.snippet}
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(source.url, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Visit Source
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {currentSources.length > 0 && (
              <Button variant="ghost" className="w-full mt-4">
                View all sources
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

