import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateJewelryDesign(prompt: string, material?: string, gemstone?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Enhanced prompt for jewelry design
    const enhancedPrompt = `
You are an expert jewelry designer. Create a detailed jewelry design specification based on this request:

User Request: "${prompt}"
Preferred Material: ${material || 'any'}
Preferred Gemstone: ${gemstone || 'any'}

Please provide:
1. Jewelry Type (ring, necklace, bracelet, earring, or pendant)
2. Recommended Material (gold, silver, platinum, rose-gold, or white-gold)
3. Recommended Gemstone (diamond, ruby, sapphire, emerald, amethyst, or none)
4. Design Style (modern, vintage, minimalist, ornate, bohemian, etc.)
5. Unique Features (engravings, patterns, special cuts, etc.)
6. Design Description (detailed visual description)

Format your response as a JSON object with these keys:
{
  "type": "jewelry type",
  "material": "recommended material",
  "gemstone": "recommended gemstone",
  "style": "design style",
  "features": ["feature1", "feature2"],
  "description": "detailed description"
}
    `.trim();

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    let designData;
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      designData = JSON.parse(cleanText);
    } catch {
      // Fallback to text parsing
      designData = parseTextResponse(text);
    }
    
    return {
      success: true,
      design: designData,
      rawResponse: text,
      prompt: prompt,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate design',
    };
  }
}

// Fallback parser for non-JSON responses
function parseTextResponse(text: string) {
  const lowerText = text.toLowerCase();
  
  // Extract jewelry type
  const types = ['ring', 'necklace', 'bracelet', 'earring', 'pendant'];
  const type = types.find(t => lowerText.includes(t)) || 'ring';
  
  // Extract materials
  const materials = ['platinum', 'rose-gold', 'white-gold', 'gold', 'silver'];
  const material = materials.find(m => lowerText.includes(m.replace('-', ' '))) || 'gold';
  
  // Extract gemstones
  const gemstones = ['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst'];
  const gemstone = gemstones.find(g => lowerText.includes(g)) || 'diamond';
  
  return {
    type,
    material,
    gemstone,
    style: 'modern',
    features: [],
    description: text,
  };
}

// Generate multiple design variations
export async function generateDesignVariations(prompt: string, count: number = 4) {
  const variations = ['modern', 'vintage', 'minimalist', 'ornate'];
  
  const promises = variations.slice(0, count).map(async (style) => {
    const styledPrompt = `${prompt}, ${style} style`;
    return generateJewelryDesign(styledPrompt);
  });
  
  const results = await Promise.all(promises);
  return results.filter(r => r.success);
}

// Get design suggestions based on preferences
export async function getDesignSuggestions(preferences: {
  occasion?: string;
  budget?: string;
  style?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `
Suggest 3 jewelry design ideas based on these preferences:
- Occasion: ${preferences.occasion || 'any'}
- Budget: ${preferences.budget || 'moderate'}
- Style: ${preferences.style || 'modern'}

Provide brief descriptions for each suggestion.
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      suggestions: text,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: 'Failed to get suggestions',
    };
  }
}