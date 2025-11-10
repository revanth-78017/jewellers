# 🔧 Port Configuration Guide

## ✅ Your App Now Runs on Any Port!

The app has been configured to run on **any port** you specify.

---

## 🚀 How to Use Different Ports

### Default Port (3000)
```bash
npm run dev
# Runs on: http://localhost:3000
```

### Custom Port - Method 1 (Environment Variable)
```bash
PORT=4000 npm run dev
# Runs on: http://localhost:4000

PORT=8080 npm run dev
# Runs on: http://localhost:8080

PORT=5173 npm run dev
# Runs on: http://localhost:5173
```

### Custom Port - Method 2 (Inline)
```bash
npm run dev -- -p 4000
# Runs on: http://localhost:4000

npm run dev -- -p 8080
# Runs on: http://localhost:8080
```

### Production Server
```bash
PORT=4000 npm start
# Production server on port 4000

npm start -- -p 8080
# Production server on port 8080
```

---

## 📋 Quick Reference

| Command | Port | Description |
|---------|------|-------------|
| `npm run dev` | 3000 | Default development |
| `PORT=4000 npm run dev` | 4000 | Dev on port 4000 |
| `PORT=8080 npm run dev` | 8080 | Dev on port 8080 |
| `npm run dev -- -p 5000` | 5000 | Dev on port 5000 |
| `npm start` | 3000 | Production default |
| `PORT=4000 npm start` | 4000 | Production on 4000 |

---

## 🔍 Check Current Port

When server starts, you'll see:
```
▲ Next.js 16.0.0 (Turbopack)
- Local:        http://localhost:YOUR_PORT
- Network:      http://192.168.x.x:YOUR_PORT
```

---

## 🛠️ Setting Permanent Custom Port

### Option 1: Create .env.local
```bash
echo "PORT=4000" >> .env.local
npm run dev
```

### Option 2: Use npm scripts
Edit `package.json`:
```json
"scripts": {
  "dev": "next dev -p 4000",
  "dev:alt": "next dev -p 8080"
}
```

---

## 🐛 Port Already in Use?

### Check What's Running
```bash
lsof -i :3000
# Shows what's using port 3000
```

### Kill Process on Port
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on any port
lsof -ti:YOUR_PORT | xargs kill -9
```

### Use Different Port
```bash
# Just use a different port!
PORT=3001 npm run dev
```

---

## 💡 Pro Tips

### Multiple Instances
Run multiple instances on different ports:
```bash
# Terminal 1
PORT=3000 npm run dev

# Terminal 2
PORT=3001 npm run dev

# Terminal 3
PORT=3002 npm run dev
```

### Docker/Deployment
Set PORT environment variable in your deployment:
```dockerfile
ENV PORT=8080
CMD ["npm", "start"]
```

### Vercel/Netlify
They automatically set the PORT. No configuration needed!

---

## 📝 Common Port Numbers

| Port | Typically Used For |
|------|-------------------|
| 3000 | Next.js default, React dev |
| 3001 | Alternative Next.js |
| 4000 | GraphQL servers |
| 5000 | Python Flask, general dev |
| 5173 | Vite default |
| 8080 | Common alternative |
| 8000 | Django, alternative servers |

---

## ✅ Current Configuration

**File**: `package.json`

**Dev Script**:
```json
"dev": "next dev -p ${PORT:-3000}"
```

**Start Script**:
```json
"start": "next start -p ${PORT:-3000}"
```

**What this means**:
- Uses `$PORT` environment variable if set
- Falls back to port 3000 if not set
- Works on any system (Mac, Linux, Windows)

---

## 🎯 Examples

### Development
```bash
# Default
npm run dev
→ http://localhost:3000

# Custom
PORT=4500 npm run dev
→ http://localhost:4500
```

### Production
```bash
# Build
npm run build

# Run on custom port
PORT=8080 npm start
→ http://localhost:8080
```

### Testing Multiple Ports
```bash
# Test port 3000
curl http://localhost:3000

# Test port 4000
PORT=4000 npm run dev
curl http://localhost:4000
```

---

## 🚀 Ready to Use!

Your app now runs on **any port** you want!

**Try it:**
```bash
# Stop current server
lsof -ti:3000 | xargs kill -9

# Start on port 4000
PORT=4000 npm run dev
```

Then visit: **http://localhost:4000** 🎉

