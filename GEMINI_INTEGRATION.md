# 🤖 Gemini AI Integration Guide

## Overview
This guide shows you how to integrate Google's Gemini AI for generating jewelry designs from text prompts.

## Step 1: Get Gemini API Key

### Option A: Gemini API (Recommended)
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key (format: `AIza...`)

### Option B: Google AI Studio
1. Visit: https://aistudio.google.com/app/apikey
2. Follow the same steps as above

**Note:** The free tier includes:
- 60 requests per minute
- 1,500 requests per day
- Perfect for development!

## Step 2: Install Required Packages

```bash
cd /Users/pranavks/MVP/jewelry-app
npm install @google/generative-ai
```

## Step 3: Create Environment File

Create a file named `.env.local` in the project root:

```env
# Gemini API Key
GEMINI_API_KEY=AIza_your_actual_api_key_here

# For client-side access (optional, but useful for direct client calls)
NEXT_PUBLIC_GEMINI_API_KEY=AIza_your_actual_api_key_here
```

**Important:** Never commit `.env.local` to Git! It's already in `.gitignore`.

## Step 4: Create Gemini Service

Create `lib/services/gemini.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateJewelryDesign(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Enhanced prompt for jewelry design
    const enhancedPrompt = `
      Create a detailed jewelry design description based on this request: "${prompt}"
      
      Include:
      - Type of jewelry (ring, necklace, bracelet, etc.)
      - Recommended materials (gold, silver, platinum, etc.)
      - Gemstone suggestions
      - Design style (modern, vintage, minimalist, etc.)
      - Unique features
      
      Format the response as a detailed design specification.
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      description: text,
      prompt: prompt,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: 'Failed to generate design',
    };
  }
}

// For image generation (using Gemini Pro Vision)
export async function generateJewelryImage(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    // Note: Gemini currently generates text descriptions
    // For actual images, you'll need to use DALL-E, Stable Diffusion, or Midjourney
    const result = await model.generateContent([
      `Create a detailed visual description for: ${prompt}`,
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      description: text,
    };
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    return {
      success: false,
      error: 'Failed to generate image description',
    };
  }
}
```

## Step 5: Create API Route

Create `app/api/generate-design/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateJewelryDesign } from '@/lib/services/gemini';

export async function POST(request: NextRequest) {
  try {
    const { prompt, material, gemstone } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate design using Gemini
    const result = await generateJewelryDesign(prompt);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Create mock design data (you can enhance this with the AI response)
    const designs = [
      {
        id: `design-${Date.now()}`,
        name: `AI Generated: ${prompt.slice(0, 30)}`,
        description: result.description,
        prompt: prompt,
        material: material || 'gold',
        gemstone: gemstone || 'diamond',
        type: extractJewelryType(result.description),
        price: calculatePrice(material, gemstone),
        imageUrl: '/images/placeholder.jpg', // You'll need image generation
        createdAt: new Date(),
      },
    ];

    return NextResponse.json({
      success: true,
      designs,
      aiDescription: result.description,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function extractJewelryType(description: string): string {
  const types = ['ring', 'necklace', 'bracelet', 'earring', 'pendant'];
  const lowerDesc = description.toLowerCase();
  
  for (const type of types) {
    if (lowerDesc.includes(type)) {
      return type;
    }
  }
  return 'ring';
}

function calculatePrice(material?: string, gemstone?: string): number {
  const basePrices: Record<string, number> = {
    gold: 1000,
    silver: 500,
    platinum: 1500,
    'rose-gold': 1100,
    'white-gold': 1200,
  };

  const gemstoneMultipliers: Record<string, number> = {
    diamond: 3.0,
    ruby: 2.0,
    sapphire: 2.2,
    emerald: 2.5,
    amethyst: 1.5,
    none: 0,
  };

  const basePrice = basePrices[material || 'gold'] || 1000;
  const multiplier = 1 + (gemstoneMultipliers[gemstone || 'diamond'] || 0);

  return Math.round(basePrice * multiplier);
}
```

## Step 6: Update Design Page

Update `app/design/page.tsx` to use the API:

```typescript
const handleGenerate = async (prompt: string) => {
  setIsGenerating(true);
  
  try {
    const response = await fetch('/api/generate-design', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        material: selectedMaterial,
        gemstone: selectedGemstone,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setGeneratedDesigns(data.designs);
      toast.success('Designs generated successfully!');
    } else {
      toast.error(data.error || 'Failed to generate designs');
    }
  } catch (error) {
    console.error('Generation error:', error);
    toast.error('Failed to generate designs');
  } finally {
    setIsGenerating(false);
  }
};
```

## Step 7: For Actual Image Generation

**Important:** Gemini Pro doesn't generate images directly. For image generation, you have these options:

### Option A: DALL-E (OpenAI)
```bash
npm install openai
```

```typescript
// lib/services/dalle.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateJewelryImage(prompt: string) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `A high-quality 3D render of ${prompt}, professional jewelry photography, white background`,
    n: 1,
    size: "1024x1024",
  });

  return response.data[0].url;
}
```

### Option B: Stable Diffusion (via Stability AI)
```bash
npm install @stability-ai/sdk
```

### Option C: Midjourney (via API)
Use their API when available

## Complete Setup Commands

```bash
# 1. Navigate to project
cd /Users/pranavks/MVP/jewelry-app

# 2. Install Gemini SDK
npm install @google/generative-ai

# 3. For image generation (choose one):
# Option A: OpenAI DALL-E
npm install openai

# Option B: Stability AI
npm install @stability-ai/sdk

# 4. Create .env.local file
cat > .env.local << 'EOF'
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# For image generation (choose one):
# OpenAI API (DALL-E)
OPENAI_API_KEY=your_openai_api_key_here

# Or Stability AI
STABILITY_API_KEY=your_stability_api_key_here
EOF

# 5. Create necessary directories
mkdir -p lib/services app/api/generate-design

# 6. Restart dev server
npm run dev
```

## Environment Variables Summary

Create `.env.local` with:

```env
# Required: Gemini for design descriptions
GEMINI_API_KEY=AIza...your_key

# Choose ONE for image generation:

# Option 1: OpenAI DALL-E (Recommended)
OPENAI_API_KEY=sk-...your_key

# Option 2: Stability AI
STABILITY_API_KEY=sk-...your_key

# Option 3: Replicate (Stable Diffusion)
REPLICATE_API_TOKEN=r8_...your_key
```

## API Key Sources

1. **Gemini**: https://makersuite.google.com/app/apikey (FREE tier available)
2. **OpenAI (DALL-E)**: https://platform.openai.com/api-keys ($$$)
3. **Stability AI**: https://platform.stability.ai/account/keys ($)
4. **Replicate**: https://replicate.com/account/api-tokens (Pay per use)

## Pricing Comparison

| Service | Free Tier | Paid Tier | Best For |
|---------|-----------|-----------|----------|
| Gemini | 60 req/min | Very cheap | Text generation |
| DALL-E 3 | No | $0.04-$0.08/image | High quality |
| Stability AI | No | $0.002-$0.01/image | Cost effective |
| Replicate | $5 credit | Pay per use | Flexibility |

## Testing

After setup, test with:

```bash
# Test Gemini connection
curl http://localhost:3000/api/generate-design \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt": "elegant diamond ring"}'
```

## Troubleshooting

### "API key not found"
- Check `.env.local` exists in project root
- Verify environment variable names match exactly
- Restart dev server after creating `.env.local`

### "Rate limit exceeded"
- Wait a few minutes
- Consider upgrading to paid tier
- Implement request caching

### "Generation failed"
- Check API key is valid
- Verify internet connection
- Check API service status

## Next Steps

1. Get your Gemini API key
2. Install dependencies
3. Create `.env.local` file
4. Create the service files
5. Test the integration
6. Choose an image generation service
7. Implement image generation

## Need Help?

- Gemini Docs: https://ai.google.dev/docs
- OpenAI Docs: https://platform.openai.com/docs
- Stability AI Docs: https://platform.stability.ai/docs

---

**Ready to integrate? Start with Step 1 and get your API key!** 🚀

