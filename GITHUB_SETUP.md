# GitHub Setup Instructions

## Option 1: If you already have a GitHub repository

1. Add your remote repository:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

2. Push to GitHub:
```bash
git branch -M main
git push -u origin main
```

## Option 2: Create a new repository on GitHub

1. Go to https://github.com/new
2. Repository name: `whatsbot-ui` (or your preferred name)
3. Description: "WhatsBot Chat UI with Next.js and WhatsBot backend"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

7. Then run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/whatsbot-ui.git
git branch -M main
git push -u origin main
```

## Quick Commands (after setting up remote)

```bash
# Set main branch
git branch -M main

# Add remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Verify

After pushing, verify at: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

