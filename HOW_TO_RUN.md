# 🚀 How to Run the KRK Jewellers Application

## Quick Start (3 Steps)

### 1. Install Dependencies
```bash
cd jewelry-app
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: **http://localhost:3000**

---

## 📋 Prerequisites

Make sure you have these installed:
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

Check your versions:
```bash
node --version  # Should be v18 or higher
npm --version   # Should be v8 or higher
```

---

## 🎯 Detailed Setup

### Step 1: Navigate to Project
```bash
cd /Users/pranavks/MVP/jewelry-app
```

### Step 2: Install All Packages
```bash
npm install
```

This will install:
- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS v4
- Three.js
- Framer Motion
- And all other dependencies (~500 packages)

**Installation time**: 1-2 minutes

### Step 3: Start Development Server
```bash
npm run dev
```

You should see:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

### Step 4: Explore the App
Open your browser and visit:
- **Landing Page**: http://localhost:3000
- **Design Generator**: http://localhost:3000/design
- **Gallery**: http://localhost:3000/gallery
- **3D Preview**: http://localhost:3000/preview
- **Customization**: http://localhost:3000/customize
- **Try-On**: http://localhost:3000/try-on
- **Checkout**: http://localhost:3000/checkout
- **Dashboard**: http://localhost:3000/dashboard

---

## 🎨 Features to Try

### 1. Create a Design
1. Click **"Start Designing"** on the homepage
2. Enter a prompt like *"A delicate gold ring with a diamond"*
3. Select materials and gemstones
4. Click **"Generate"**

### 2. Explore 3D Preview
1. Go to `/preview`
2. **Drag** to rotate the jewelry
3. **Scroll** to zoom in/out
4. Change materials and see updates in real-time
5. Toggle auto-rotate

### 3. Virtual Try-On
1. Navigate to `/try-on`
2. Click **"Use Camera"** (grant permissions) or **"Upload Photo"**
3. See the AR overlay simulation
4. Download your try-on image

### 4. Customize a Design
1. Go to `/customize`
2. Select materials, gemstones, finish
3. Adjust ring size with the slider
4. Add engraving text
5. View live 3D preview
6. Add to cart or save

### 5. Browse Gallery
1. Visit `/gallery`
2. Use filters to narrow down designs
3. Switch between grid and list view
4. Click on any design to see details
5. Add favorites

### 6. Complete Checkout
1. Add items to cart
2. Go to `/checkout`
3. Fill in contact and shipping info
4. Enter payment details (UI only, no real processing)
5. Review order and place

---

## 🛠️ Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🌐 Browser Support

### Recommended Browsers:
- ✅ **Chrome** 90+ (Best experience)
- ✅ **Safari** 14+
- ✅ **Firefox** 88+
- ✅ **Edge** 90+

### Features Requiring Permissions:
- **Camera Access** (for virtual try-on)
- **Microphone** (for voice input - UI ready)

---

## ⚙️ Configuration

### Theme
Toggle dark/light mode using the moon/sun icon in the navbar.

### Port Configuration
To use a different port:
```bash
npm run dev -- -p 3001
```

### Environment Variables
If you add backend integration, create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
```

### TypeScript Errors in IDE
- Restart your IDE
- In VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

### Three.js Not Loading
- Check browser console for errors
- Ensure you're using a modern browser
- Try hard refresh: `Cmd/Ctrl + Shift + R`

### Camera Permission Denied
- Click the camera icon in browser address bar
- Allow camera access
- Refresh the page
- Note: Camera requires HTTPS in production

### Build Errors
The project uses Tailwind CSS v4 (beta). If you encounter build errors:
```bash
# Clean build
rm -rf .next
npm run build
```

### Slow Development Server
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

---

## 📱 Mobile Testing

### Test on Your Phone:
1. Find your computer's local IP:
   ```bash
   # macOS
   ipconfig getifaddr en0
   
   # Linux
   hostname -I
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. On your phone, visit:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

Example: `http://192.168.1.100:3000`

---

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in `.next/`

### Start Production Server
```bash
npm start
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms
- **Netlify**: Connect your Git repo
- **AWS Amplify**: Use the Next.js preset
- **Docker**: Create a Dockerfile (see Next.js docs)

---

## 💻 Development Tips

### Hot Reload
The dev server supports hot module replacement. Changes to files will automatically reflect in the browser.

### File Watching
Next.js watches these directories:
- `app/` - Pages and layouts
- `components/` - React components
- `lib/` - Utilities and helpers
- `public/` - Static assets

### Performance
For better performance during development:
```bash
# Use Turbopack (experimental)
npm run dev --turbo
```

---

## 📖 Documentation

- **Full Documentation**: See `README.md`
- **Quick Start Guide**: See `QUICKSTART.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`

---

## 🎉 You're Ready!

The application should now be running at **http://localhost:3000**

Explore all the features and enjoy designing beautiful jewelry! 💎

**Need Help?** Check the troubleshooting section above or review the documentation files.

