# WhatsBot UI - Complete Project Code Explanation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Core Components](#core-components)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Data Flow](#data-flow)
9. [Key Features](#key-features)
10. [Deployment](#deployment)

---

## 🎯 Project Overview

**WhatsBot UI** is a modern, Perplexity-inspired AI chat interface built with Next.js 14. It provides a three-panel layout for conversations, real-time streaming responses, source attribution, and conversation history management.

### Key Capabilities
- Real-time streaming chat with LLM backend
- Conversation history with persistent state
- Source attribution panel
- Dark/light theme support
- Responsive, resizable layout
- Markdown rendering with code highlighting

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ History  │  │   Chat   │  │ Sources  │             │
│  │ Sidebar  │  │  Panel   │  │  Panel   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│       │              │              │                  │
│       └──────────────┴──────────────┘                  │
│                    Zustand Store                        │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ HTTP/SSE
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js App (Server)                       │
│  ┌──────────────────────────────────────┐             │
│  │      /api/chat (Route Handler)       │             │
│  │  - Receives messages from client     │             │
│  │  - Calls WhatsBot backend            │             │
│  │  - Streams response back             │             │
│  └──────────────┬───────────────────────┘             │
└─────────────────┼──────────────────────────────────────┘
                  │
                  │ HTTP POST
                  ▼
┌─────────────────────────────────────────────────────────┐
│         WhatsBot Backend (External API)                 │
│  https://agent-restless-forest-3023.fly.dev/chat/invoke│
│  - LangChain Pipes (LCEL)                              │
│  - Groq LLM Integration                                │
│  - Real-time web search                                │
│  - Returns: {"output": "...", "metadata": {...}}       │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14** (App Router) - React framework with server-side rendering
- **TypeScript** - Type safety and better developer experience
- **React 18** - UI library with hooks and concurrent features

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **next-themes** - Theme management (dark/light mode)
- **Lucide React** - Icon library

### State Management
- **Zustand** - Lightweight state management library
  - Manages conversations, messages, and sources
  - Simple API with minimal boilerplate

### Chat & Streaming
- **Vercel AI SDK** (`ai` package) - Handles streaming chat
  - `useChat` hook for client-side chat management
  - Automatic streaming response handling

### Layout & UX
- **react-resizable-panels** - Resizable panel layout
- **react-markdown** - Markdown rendering for messages
- **remark-gfm** - GitHub Flavored Markdown support
- **rehype-highlight** - Code syntax highlighting

### Utilities
- **date-fns** - Date formatting (relative time)
- **clsx** + **tailwind-merge** - Conditional class names
- **class-variance-authority** - Component variant management

---

## 📁 Project Structure

```
whatsbot-ui/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # API route handler
│   ├── chat/
│   │   └── page.tsx             # Main chat page
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Home page (redirects to /chat)
│   └── globals.css              # Global styles + Tailwind
│
├── components/                   # React components
│   ├── chat/                    # Chat-related components
│   │   ├── ChatInput.tsx        # Message input component
│   │   ├── ChatMessages.tsx     # Messages container
│   │   └── MessageBubble.tsx    # Individual message display
│   ├── layout/                  # Layout components
│   │   ├── AppShell.tsx         # Main 3-panel layout
│   │   ├── TopNav.tsx           # Top navigation bar
│   │   └── ThemeToggle.tsx      # Dark/light mode toggle
│   ├── sidebar/
│   │   └── HistorySidebar.tsx   # Conversation history
│   ├── sources/
│   │   └── SourcePanel.tsx      # Sources display panel
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── textarea.tsx
│   │   └── dropdown-menu.tsx
│   └── theme-provider.tsx       # Theme context provider
│
├── lib/                         # Utility libraries
│   ├── store.ts                 # Zustand state store
│   └── utils.ts                 # Helper functions (cn, etc.)
│
├── public/                      # Static assets
│
├── Configuration Files
│   ├── package.json             # Dependencies & scripts
│   ├── tsconfig.json            # TypeScript config
│   ├── tailwind.config.ts       # Tailwind CSS config
│   ├── next.config.js           # Next.js config
│   ├── components.json          # shadcn/ui config
│   ├── Dockerfile               # Container build config
│   └── fly.toml                 # Fly.io deployment config
│
└── Documentation
    ├── README.md
    ├── SETUP.md
    └── ...
```

---

## 🧩 Core Components

### 1. **AppShell** (`components/layout/AppShell.tsx`)
The main layout wrapper that creates the three-panel interface.

**Responsibilities:**
- Creates resizable panels using `react-resizable-panels`
- Left panel: History sidebar (20% default)
- Center panel: Chat interface (55% default)
- Right panel: Sources (25% default)
- Handles panel resizing and responsive behavior

**Key Code:**
```typescript
<PanelGroup direction="horizontal">
  <Panel defaultSize={20}> {/* History */}
  <Panel defaultSize={55}> {/* Chat */}
  <Panel defaultSize={25}> {/* Sources */}
</PanelGroup>
```

---

### 2. **ChatPage** (`app/chat/page.tsx`)
The main chat interface page that orchestrates all chat functionality.

**Responsibilities:**
- Manages conversation state via Zustand
- Integrates Vercel AI SDK's `useChat` hook
- Handles message sending and receiving
- Syncs streaming messages with persistent store
- Creates new conversations automatically

**Key Features:**
- **Message Persistence**: Messages saved to Zustand store
- **Streaming Handling**: Keeps streaming message visible until saved
- **Conversation Management**: Auto-creates conversations on first message

**Data Flow:**
1. User types message → `handleSend()` called
2. Message added to store immediately
3. `append()` sends to `/api/chat`
4. Response streams back via `useChat`
5. On finish, message saved to store

---

### 3. **API Route** (`app/api/chat/route.ts`)
The server-side API handler that bridges frontend and backend.

**Responsibilities:**
- Receives messages from client
- Extracts last user message (backend expects single string)
- Calls WhatsBot backend API
- Handles both streaming and JSON responses
- Converts backend response to Vercel AI SDK format
- Streams response back to client

**Request Flow:**
```
Client → POST /api/chat
  { messages: [{role: "user", content: "..."}] }
    ↓
Extract last user message
    ↓
POST to WhatsBot Backend
  { input: "user message" }
    ↓
Receive: { output: "...", metadata: {...} }
    ↓
Stream back to client (word-by-word)
```

**Key Code:**
```typescript
// Extract user message
const lastUserMessage = messages
  .filter(msg => msg.role === 'user')
  .pop()?.content || ''

// Call backend
const response = await fetch(backendUrl, {
  method: 'POST',
  body: JSON.stringify({ input: lastUserMessage })
})

// Stream response
const words = responseText.split(' ')
for (const word of words) {
  controller.enqueue(encoder.encode(`0:${JSON.stringify(word + ' ')}\n`))
}
```

---

### 4. **ChatInput** (`components/chat/ChatInput.tsx`)
The message input component with multiline support.

**Features:**
- Multiline textarea (auto-resizes)
- Enter to send, Shift+Enter for new line
- Send button with icon
- Disabled state during loading
- Visual feedback (placeholder text)

---

### 5. **MessageBubble** (`components/chat/MessageBubble.tsx`)
Renders individual chat messages.

**Features:**
- User messages: Right-aligned, primary color
- Assistant messages: Left-aligned, muted background
- Markdown rendering with syntax highlighting
- Code block support
- Streaming indicator (pulse animation)
- Avatar icons (User/Bot)

**Markdown Processing:**
- Uses `react-markdown` for rendering
- `remark-gfm` for GitHub Flavored Markdown
- `rehype-highlight` for code syntax highlighting
- Custom code component for inline vs block code

---

### 6. **HistorySidebar** (`components/sidebar/HistorySidebar.tsx`)
Manages conversation history.

**Features:**
- Lists all conversations with titles
- Shows relative timestamps ("2 hours ago")
- "New Chat" button
- Click to load conversation
- Delete conversation (hover to reveal)
- Highlights active conversation

**State Management:**
- Reads from Zustand store: `conversations[]`
- Updates via: `setCurrentConversation()`, `deleteConversation()`

---

### 7. **SourcePanel** (`components/sources/SourcePanel.tsx`)
Displays sources/references for the latest assistant message.

**Features:**
- Shows sources for last assistant message
- Card-based layout with title, snippet, URL
- "Visit Source" button (opens in new tab)
- Empty state when no sources
- Memoized for performance

**Data Source:**
- Reads from Zustand: `sources[messageId]`
- Finds last assistant message in current conversation
- Displays associated sources

---

## 🗄️ State Management

### Zustand Store (`lib/store.ts`)

The application uses Zustand for global state management. It's lightweight and doesn't require providers.

**State Structure:**
```typescript
{
  conversations: Conversation[]           // List of all conversations
  currentConversationId: string | null    // Active conversation
  messages: Record<string, Message[]>     // Messages by conversation ID
  sources: Record<string, Source[]>       // Sources by message ID
}
```

**Key Actions:**
- `createConversation(title)` - Creates new conversation, returns ID
- `setCurrentConversation(id)` - Switches active conversation
- `addMessage(conversationId, message)` - Adds message to conversation
- `setSources(messageId, sources)` - Associates sources with message
- `deleteConversation(id)` - Removes conversation and all data
- `clearCurrentConversation()` - Clears active conversation

**Data Model:**
```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  lastUpdated: Date
}

interface Source {
  id: string
  title: string
  url: string
  snippet: string
}
```

**Why Zustand?**
- No provider wrapping needed
- Simple API, minimal boilerplate
- Good TypeScript support
- Small bundle size
- Easy to test

---

## 🔌 API Integration

### Backend API Contract

**Endpoint:** `https://agent-restless-forest-3023.fly.dev/chat/invoke`

**Request Format:**
```json
{
  "input": "user message string"
}
```

**Response Format:**
```json
{
  "output": "assistant response text",
  "metadata": {
    "run_id": "...",
    "sources": [...]  // Optional
  }
}
```

### Frontend API Route (`/api/chat`)

**Purpose:** Proxy between frontend and backend, handles format conversion.

**Process:**
1. Receives `{ messages: [...] }` from Vercel AI SDK
2. Extracts last user message
3. Converts to `{ input: "..." }` format
4. Calls backend API
5. Receives JSON response
6. Extracts `output` field
7. Streams response word-by-word in Vercel AI SDK format
8. Returns streaming response to client

**Streaming Format:**
```
0:"word1 "
0:"word2 "
0:"word3 "
...
```

This format is compatible with Vercel AI SDK's `useChat` hook.

---

## 🔄 Data Flow

### Complete Message Flow

```
1. User Types Message
   └─> ChatInput component
       └─> handleSend() called

2. Message Saved to Store
   └─> addMessage(conversationId, userMessage)
       └─> Zustand store updated

3. API Call Initiated
   └─> append({ role: 'user', content })
       └─> useChat hook sends to /api/chat

4. Server Processing
   └─> /api/chat route handler
       ├─> Extract user message
       ├─> Call WhatsBot backend
       ├─> Receive JSON response
       └─> Stream response back

5. Streaming Response
   └─> useChat receives stream
       ├─> Updates chatMessages state
       ├─> Streaming message displayed
       └─> onFinish() callback fired

6. Message Persisted
   └─> onFinish() saves to store
       ├─> addMessage(conversationId, assistantMessage)
       └─> setSources(messageId, sources) if available

7. UI Updates
   └─> Store messages displayed
       └─> Streaming message cleared
```

### State Synchronization

The app maintains two message sources:
1. **Vercel AI SDK messages** (`chatMessages`) - For streaming
2. **Zustand store messages** (`storeMessages`) - For persistence

**Synchronization Logic:**
- User messages: Synced immediately to store
- Assistant messages: Shown from `chatMessages` while streaming
- After streaming: Saved to store, then displayed from store
- Streaming message: Shown if count in `chatMessages` > count in store

---

## ✨ Key Features

### 1. **Real-Time Streaming**
- Responses stream word-by-word
- Smooth animation (30ms delay per word)
- No message loss during streaming
- Persistent after completion

### 2. **Conversation Management**
- Automatic conversation creation
- Title from first message (first 50 chars)
- Conversation history with timestamps
- Delete conversations
- Switch between conversations

### 3. **Source Attribution**
- Sources displayed in right panel
- Associated with assistant messages
- Click to visit source
- Empty state when no sources

### 4. **Theme Support**
- Dark/light mode toggle
- System preference detection
- Persistent theme selection
- Smooth transitions

### 5. **Responsive Layout**
- Resizable panels
- Minimum/maximum sizes
- Responsive on different screen sizes
- Panel handles for resizing

### 6. **Markdown Support**
- Full markdown rendering
- Code syntax highlighting
- GitHub Flavored Markdown
- Inline and block code support

---

## 🚀 Deployment

### Fly.io Configuration

**Dockerfile:**
- Multi-stage build for optimization
- Node.js 20 Alpine base
- Separate stages for deps, build, and runtime
- Standalone Next.js output
- Non-root user for security

**fly.toml:**
- App name: `whatsbot-ui`
- Region: `iad` (Washington, D.C.)
- Auto-scaling: Machines stop when idle
- High availability: 2 machines minimum
- Port: 3000

**Environment Variables:**
- `WHATSBOT_BACKEND_URL` - Set via `fly secrets set`

### Build Process

1. **Dependencies:** `npm ci` installs all packages
2. **Build:** `npm run build` creates optimized Next.js build
3. **Standalone:** Next.js outputs standalone server
4. **Docker:** Multi-stage build creates minimal image
5. **Deploy:** Fly.io builds and deploys container

### Deployment Commands

```bash
# Create app
fly apps create whatsbot-ui

# Set secrets
fly secrets set WHATSBOT_BACKEND_URL=https://...

# Deploy
fly deploy

# View logs
fly logs

# Check status
fly status
```

---

## 🔧 Configuration Files

### `next.config.js`
- `output: 'standalone'` - Creates standalone build for Docker
- `reactStrictMode: true` - React strict mode enabled

### `tailwind.config.ts`
- shadcn/ui theme configuration
- Custom colors and design tokens
- Dark mode support via CSS variables

### `tsconfig.json`
- TypeScript strict mode
- Path aliases (`@/*` → `./*`)
- Next.js plugin configuration

### `components.json`
- shadcn/ui configuration
- Component paths and aliases
- Style configuration

---

## 📝 Key Design Decisions

### 1. **Why Zustand over Redux/Context?**
- Simpler API, less boilerplate
- No provider needed
- Better TypeScript inference
- Smaller bundle size

### 2. **Why Vercel AI SDK?**
- Built-in streaming support
- Easy integration with LLM APIs
- Automatic message management
- Type-safe hooks

### 3. **Why Next.js App Router?**
- Modern React patterns
- Server components support
- Better performance
- Simplified routing

### 4. **Why Word-by-Word Streaming?**
- Smooth user experience
- Simulates real-time response
- Works with any backend (even non-streaming)
- Consistent animation

### 5. **Why Three-Panel Layout?**
- Familiar UX (Perplexity-style)
- Efficient use of screen space
- Clear separation of concerns
- Resizable for user preference

---

## 🐛 Known Limitations & Future Improvements

### Current Limitations
1. **No Backend Persistence**: Conversations stored only in browser (Zustand)
2. **No Authentication**: All data is local
3. **Simple Source Handling**: Sources not fully integrated from backend metadata
4. **No Search**: Can't search conversation history
5. **No Export**: Can't export conversations

### Potential Improvements
1. **Backend Integration**: Store conversations in database
2. **User Authentication**: Multi-user support
3. **Enhanced Sources**: Better source parsing from metadata
4. **Search Functionality**: Full-text search in conversations
5. **Export/Import**: JSON export of conversations
6. **Settings Panel**: Customizable UI preferences
7. **Keyboard Shortcuts**: Power user features
8. **Mobile Optimization**: Better mobile experience

---

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Zustand Docs**: https://zustand-demo.pmnd.rs/
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🎓 Learning Points

This project demonstrates:
- Modern React patterns (hooks, context)
- Next.js App Router architecture
- State management with Zustand
- Real-time streaming with SSE
- TypeScript best practices
- Component composition
- Responsive design
- Docker containerization
- Cloud deployment (Fly.io)

---

**Last Updated:** December 2025
**Version:** 0.1.0

