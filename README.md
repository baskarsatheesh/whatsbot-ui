# WhatsBot UI

A Perplexity-like AI search and chat interface built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 Modern, responsive UI with dark/light theme support
- 💬 Real-time streaming chat interface
- 📚 Source panel for displaying references
- 📜 Conversation history sidebar
- 🔄 Resizable panels for optimal layout
- 🚀 Ready for deployment on Fly.io

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **Zustand** for state management
- **Vercel AI SDK** for streaming
- **react-resizable-panels** for layout
- **react-markdown** for message rendering

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set:
```
WHATSBOT_BACKEND_URL=https://agent-restless-forest-3023.fly.dev/chat/invoke
```

Or for local development:
```
WHATSBOT_BACKEND_URL=http://localhost:8000/chat/invoke
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `WHATSBOT_BACKEND_URL`: Full URL of the WhatsBot backend API endpoint (including path, e.g., `https://agent-restless-forest-3023.fly.dev/chat/invoke`)

## Deployment to Fly.io

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login to Fly.io:
```bash
fly auth login
```

3. Create a new app (if not already created):
```bash
fly apps create whatsbot-ui
```

4. Set environment variables:
```bash
fly secrets set WHATSBOT_BACKEND_URL=https://agent-restless-forest-3023.fly.dev/chat/invoke
```

5. Deploy:
```bash
fly deploy
```

## Backend API Integration

The app expects the WhatsBot backend to expose a `/chat/invoke` endpoint that accepts:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your message here"
    }
  ]
}
```

And returns either:
- A streaming response (text/event-stream)
- A JSON response with:
  - `response` or `message` or `content` or `text`: The assistant's response
  - `sources` or `references`: Array of source objects with `id`, `title`, `url`, `snippet`

## Project Structure

```
whatsbot-ui/
├── app/
│   ├── api/chat/        # API route for chat
│   ├── chat/            # Chat page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/
│   ├── chat/            # Chat components
│   ├── layout/          # Layout components
│   ├── sidebar/         # History sidebar
│   ├── sources/         # Sources panel
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── store.ts         # Zustand store
│   └── utils.ts         # Utilities
└── public/              # Static assets
```

## License

MIT

