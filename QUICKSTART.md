# 🚀 Quick Start Guide

Get up and running with KRK Jewellers in just a few minutes!

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

## Installation Steps

### 1. Navigate to the project directory
```bash
cd jewelry-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 First Steps

### Explore the Landing Page
- Check out the hero section with animated elements
- View the features showcase
- Click "Start Designing" to begin

### Create Your First Design
1. Click **"Start Designing"** or navigate to `/design`
2. Enter a prompt like "A delicate gold ring with a diamond"
3. Select your preferred material (Gold, Silver, Platinum, etc.)
4. Choose a gemstone (Diamond, Ruby, Sapphire, etc.)
5. Click **"Generate"** and wait for the AI to create designs

### Browse the Gallery
1. Navigate to `/gallery`
2. Use filters to narrow down designs by:
   - Jewelry type (Ring, Necklace, Bracelet, etc.)
   - Material
   - Gemstone
   - Price range
3. Click on any design to view details

### Try 3D Preview
1. Go to `/preview`
2. Interact with the 3D model:
   - **Drag** to rotate
   - **Scroll** to zoom
   - Toggle auto-rotate
3. Change materials and gemstones in real-time
4. Export CAD files (UI ready, backend needed)

### Virtual Try-On
1. Navigate to `/try-on`
2. Select jewelry type
3. Choose either:
   - **Use Camera**: Live camera feed
   - **Upload Photo**: Use an existing photo
4. See the AR overlay simulation
5. Download the result

### Customize Your Design
1. Go to `/customize`
2. Select all parameters:
   - Material
   - Gemstone
   - Finish (Polished, Matte, Brushed)
   - Size (for rings)
   - Engraving text
3. View live 3D preview
4. Add to cart or save design

### Complete a Purchase
1. Add items to cart from any design page
2. Navigate to `/checkout`
3. Fill in:
   - Contact information
   - Shipping address
   - Payment details (UI only, no real processing)
4. Review order summary
5. Place order

### View Your Dashboard
1. Go to `/dashboard`
2. Browse tabs:
   - **My Designs**: All saved designs
   - **Favorites**: Liked designs
   - **Orders**: Order history
   - **Settings**: Account preferences

## 🎨 Customization Tips

### Change Theme
- Click the moon/sun icon in the navbar to toggle dark/light mode
- Theme preference is automatically saved

### Adjust Colors
- Edit CSS variables in `app/globals.css`
- Modify the `:root` and `.dark` selectors

### Add New Materials
- Edit `lib/utils/constants.ts`
- Add to the `MATERIALS` array

### Modify 3D Models
- Edit `components/preview/ThreeDViewer.tsx`
- Replace Three.js geometries with your own

## 📝 Common Tasks

### Add a New Page
```bash
# Create a new page
mkdir app/your-page
touch app/your-page/page.tsx
```

### Add a New Component
```bash
# Create a component
touch components/your-component/YourComponent.tsx
```

### Add Dependencies
```bash
npm install package-name
npm install -D @types/package-name  # For TypeScript types
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Three.js/React-Three-Fiber Issues
- Make sure you're using dynamic imports for 3D components
- Check `next.config.ts` for proper configuration

## 🚀 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📦 Project Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 💡 Pro Tips

1. **Use the Design Generator** to create unique designs quickly
2. **Save your favorites** for easy access later
3. **Try different materials** to see how they affect the design
4. **Use the 3D preview** to inspect designs from all angles
5. **Enable dark mode** for a premium experience

## 🆘 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review component files for implementation examples
- Check the TypeScript types in `lib/types/index.ts`

## 🎉 You're All Set!

Explore the application and start creating beautiful jewelry designs. Happy designing! 💎

