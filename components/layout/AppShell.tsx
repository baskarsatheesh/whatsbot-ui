'use client'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { TopNav } from './TopNav'
import { HistorySidebar } from '@/components/sidebar/HistorySidebar'
import { SourcePanel } from '@/components/sources/SourcePanel'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel - History */}
          <Panel defaultSize={20} minSize={15} maxSize={30} className="border-r">
            <HistorySidebar />
          </Panel>
          
          <PanelResizeHandle className="w-1 bg-border hover:bg-border/80 transition-colors" />
          
          {/* Center Panel - Chat */}
          <Panel defaultSize={55} minSize={40}>
            {children}
          </Panel>
          
          <PanelResizeHandle className="w-1 bg-border hover:bg-border/80 transition-colors" />
          
          {/* Right Panel - Sources */}
          <Panel defaultSize={25} minSize={20} maxSize={35} className="border-l">
            <SourcePanel />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

