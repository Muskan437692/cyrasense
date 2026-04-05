# CyraSense 🌸

**AI Menstrual Health & Wellness Platform**

A privacy-first web application for tracking cycle health, wellness tips, games, and personalized insights.

## Features
- 📊 Dashboard with cycle tracking
- 📅 Calendar view
- 💬 AI Chatbot support
- 🎮 Mini games with rewards
- 🧘 Yoga & wellness
- 🏪 Store with achievements
- ⚙️ Customizable settings

## Privacy
🔒 All data is stored locally in your browser only. Nothing is sent to external servers.

## How to Use

### Option 1: Deploy to Netlify (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Sign up (free)
3. Drag & drop this project folder onto Netlify
4. Get an instant live link to share!

### Option 2: Run Locally
```bash
node -e "const http = require('http'); const fs = require('fs'); const path = require('path'); const server = http.createServer((req, res) => { let filePath = path.join('.', req.url === '/' ? 'index.html' : req.url); fs.readFile(filePath, (err, content) => { if (err) { res.writeHead(404); res.end('Not found'); } else { const ext = path.extname(filePath); const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' }; res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' }); res.end(content); } }); }); server.listen(8000, () => console.log('Server running at http://localhost:8000')); "
```

Then visit `http://localhost:8000`

## Sharing with Friends
Each friend gets their own private account and local data storage. No shared data between users.

---
Made with ❤️ for wellness
