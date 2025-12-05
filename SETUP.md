# Setup Guide

## Prerequisites

1. **Node.js 20+** - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` (should show v20.x.x or higher)
   - Verify npm: `npm --version` (should show 10.x.x or higher)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Vercel AI SDK
- Zustand
- And all other dependencies

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Create .env.local file
cat > .env.local << EOF
WHATSBOT_BACKEND_URL=https://agent-restless-forest-3023.fly.dev/chat/invoke
EOF
```

Or manually create `.env.local` with:
```
WHATSBOT_BACKEND_URL=https://agent-restless-forest-3023.fly.dev/chat/invoke
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 4. Build for Production (Optional)

```bash
npm run build
npm start
```

## Troubleshooting

### If you get "command not found: npm"
- Make sure Node.js is installed
- Try restarting your terminal
- On macOS/Linux, you may need to add Node.js to your PATH

### If you get module not found errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### If the app doesn't connect to backend
- Check that `.env.local` exists and has the correct `WHATSBOT_BACKEND_URL`
- Verify the backend is running and accessible
- Check browser console for errors

## Quick Start Commands

```bash
# Install everything
npm install

# Create environment file
echo "WHATSBOT_BACKEND_URL=https://agent-restless-forest-3023.fly.dev/chat/invoke" > .env.local

# Start development server
npm run dev
```

## What Gets Installed

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Vercel AI SDK** - For streaming chat responses
- **Zustand** - Lightweight state management
- **react-resizable-panels** - Resizable layout panels
- **react-markdown** - Markdown rendering for messages
- **Lucide React** - Icon library
- And more...

