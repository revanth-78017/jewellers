# 🎨 Image Generation Setup Guide

## Current Status
- ✅ **Gemini AI**: Generates text descriptions (WORKING)
- ❌ **Images**: Currently placeholders (NOT GENERATED)

## Why No Images?

**Gemini AI** is a **text-only** model. It creates descriptions but cannot generate actual images.

For real jewelry images, you need an **image generation AI** like:
1. DALL-E 3 (OpenAI) - Best quality
2. Stable Diffusion (Stability AI) - Most affordable
3. Midjourney (via API) - Most creative

---

## 🚀 Option 1: DALL-E 3 (Recommended)

### Why DALL-E 3?
- ✅ Best image quality
- ✅ Excellent at jewelry/product photography
- ✅ Easy to integrate
- ✅ Photorealistic results
- ⚠️ Costs: $0.04 per image (standard) or $0.08 (HD)

### Step 1: Get OpenAI API Key
1. Visit: https://platform.openai.com/api-keys
2. Sign in or create account
3. Click **"Create new secret key"**
4. Copy your key (starts with `sk-...`)
5. Add $5-10 credits at: https://platform.openai.com/account/billing

### Step 2: Install OpenAI SDK
```bash
cd /Users/pranavks/MVP/jewelry-app
npm install openai
```

### Step 3: Add API Key to .env.local
```bash
# Add this line to your .env.local file:
OPENAI_API_KEY=sk-your_actual_openai_key_here
```

### Step 4: Create Image Generation Service

Create `lib/services/dalle.ts`:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateJewelryImage(description: string, type: string) {
  try {
    const enhancedPrompt = `Professional product photography of ${description}. 
    High-quality 3D render, ${type}, white background, studio lighting, 
    hyper-realistic, 8k quality, jewelry photography style, centered composition, 
    sharp focus, elegant presentation`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard", // or "hd" for higher quality
      style: "natural", // or "vivid"
    });

    return {
      success: true,
      imageUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    };
  } catch (error) {
    console.error('DALL-E Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image',
    };
  }
}
```

### Step 5: Update API Route

Modify `app/api/generate-design/route.ts`:
```typescript
import { generateJewelryImage } from '@/lib/services/dalle';

// Inside the POST function, after Gemini generates the description:
const imageResults = await Promise.all(
  Array.from({ length: 4 }, async (_, i) => {
    // Generate image for each design
    const imageResult = await generateJewelryImage(
      aiDesign?.description || prompt,
      aiDesign?.type || 'ring'
    );
    return imageResult.success ? imageResult.imageUrl : `/images/placeholder-${i + 1}.jpg`;
  })
);

// Then use real image URLs in designs array:
const designs = Array.from({ length: 4 }, (_, i) => ({
  // ... other properties
  imageUrl: imageResults[i], // Real AI-generated image!
  // ... rest of properties
}));
```

---

## 💰 Option 2: Stable Diffusion (Most Affordable)

### Why Stable Diffusion?
- ✅ Much cheaper ($0.002-0.01 per image)
- ✅ Good quality
- ✅ Open source
- ✅ More control over style
- ⚠️ Requires more prompt engineering

### Step 1: Get Stability AI Key
Visit: https://platform.stability.ai/account/keys

### Step 2: Install SDK
```bash
npm install stability-sdk
```

### Step 3: Create Service
```typescript
// lib/services/stable-diffusion.ts
import { StabilityClient } from 'stability-sdk';

const client = new StabilityClient({
  apiKey: process.env.STABILITY_API_KEY,
});

export async function generateJewelryImage(description: string) {
  try {
    const response = await client.generate({
      prompt: `Professional jewelry photography, ${description}, 
               white background, studio lighting, high detail, 
               product shot, 8k, photorealistic`,
      negativePrompt: "blur, low quality, distorted, ugly, watermark",
      width: 1024,
      height: 1024,
      samples: 1,
      steps: 30,
    });

    return {
      success: true,
      imageUrl: response.artifacts[0].base64,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to generate image',
    };
  }
}
```

---

## 🎯 Option 3: Replicate (Flexible)

### Why Replicate?
- ✅ Access to multiple models
- ✅ Pay per use
- ✅ Good documentation
- ✅ Try different models

### Step 1: Get API Token
Visit: https://replicate.com/account/api-tokens

### Step 2: Install
```bash
npm install replicate
```

### Step 3: Use
```typescript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const output = await replicate.run(
  "stability-ai/sdxl:latest",
  {
    input: {
      prompt: "professional jewelry photography...",
      width: 1024,
      height: 1024,
    }
  }
);
```

---

## 📊 Cost Comparison

| Service | Cost per Image | Quality | Speed | Best For |
|---------|---------------|---------|-------|----------|
| DALL-E 3 Standard | $0.04 | ⭐⭐⭐⭐⭐ | Fast | Production |
| DALL-E 3 HD | $0.08 | ⭐⭐⭐⭐⭐ | Fast | Premium |
| Stable Diffusion | $0.002 | ⭐⭐⭐⭐ | Medium | High volume |
| Replicate SDXL | $0.01 | ⭐⭐⭐⭐ | Medium | Flexibility |

---

## 🎨 Quick Setup for DALL-E (5 Minutes)

### Complete Installation:

```bash
# 1. Install OpenAI
cd /Users/pranavks/MVP/jewelry-app
npm install openai

# 2. Add API key to .env.local
echo 'OPENAI_API_KEY=sk-your_key_here' >> .env.local

# 3. Create the service file (I'll do this for you)
# 4. Update the API route (I'll do this for you)

# 5. Restart server
npm run dev
```

---

## 🆓 Free/Budget Options

### Option A: Use Stock Images
- Search Unsplash/Pexels for jewelry images
- Cache locally
- Good for MVP/demo

### Option B: Use 3D Renders
- Use Three.js to capture screenshots
- Save as actual images
- Free but lower quality

### Option C: Replicate Free Tier
- $5 free credits
- Test before committing

---

## ⚡ Quick Test (DALL-E)

Once you have OpenAI API key:

```bash
# Test image generation
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -d '{
    "model": "dall-e-3",
    "prompt": "Professional jewelry photography of elegant diamond ring",
    "n": 1,
    "size": "1024x1024"
  }'
```

---

## 🎯 Recommended Setup

**For Development:**
1. Start with Gemini (text) - Already working! ✅
2. Use placeholder images - Currently doing this
3. Test with 1-2 DALL-E generations
4. Evaluate quality & cost

**For Production:**
1. Use DALL-E 3 for hero images (high quality)
2. Use Stable Diffusion for variations (cost effective)
3. Cache generated images (save money)
4. Offer "Generate Images" as premium feature

---

## 💡 Current Status

Your app RIGHT NOW:
```
User prompt → Gemini AI → Text description (✅ Working!)
                         ↓
                    Placeholder images (❌ Not real)
```

After image generation setup:
```
User prompt → Gemini AI → Text description (✅)
                         ↓
                    DALL-E 3 → Real images (✅)
```

---

## 🚀 Want Me to Set It Up?

I can help you integrate DALL-E 3 right now! Just:

1. Get your OpenAI API key from: https://platform.openai.com/api-keys
2. Add $5-10 credits at: https://platform.openai.com/account/billing
3. Share the key with me (starts with `sk-...`)
4. I'll integrate it in 5 minutes!

---

## 📝 Summary

**Current:** 
- Gemini generates descriptions ✅
- Images are placeholders ❌

**To fix:**
- Need image generation AI
- Recommended: DALL-E 3
- Cost: ~$0.04 per image
- Setup time: 5 minutes

**Alternative:**
- Keep placeholders for now
- Add "Generate Images" button later
- Users pay per generation (premium feature)

---

Would you like me to:
1. Set up DALL-E 3 integration now?
2. Set up Stable Diffusion (cheaper)?
3. Keep placeholders for now?

Let me know! 🎨

