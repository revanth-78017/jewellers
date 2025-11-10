// DALL-E 3 service for generating realistic jewelry images

import OpenAI from 'openai';
import { JewelryType, Material, Gemstone } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateJewelryImageParams {
  type: JewelryType;
  material: Material;
  gemstone: Gemstone;
  customPrompt?: string;
  style?: 'photorealistic' | 'artistic' | 'minimalist';
}

interface GenerateJewelryImageResult {
  imageUrl: string;
  revisedPrompt: string;
}

/**
 * Build a detailed prompt for DALL-E 3 based on jewelry specifications
 */
export function buildJewelryPrompt(params: GenerateJewelryImageParams): string {
  const { type, material, gemstone, customPrompt, style = 'photorealistic' } = params;

  // Material descriptions
  const materialDescriptions: Record<Material, string> = {
    'gold': '18k yellow gold',
    'silver': 'sterling silver 925',
    'platinum': 'platinum',
    'rose-gold': '18k rose gold',
    'white-gold': '18k white gold',
  };

  // Gemstone descriptions
  const gemstoneDescriptions: Record<Gemstone, string> = {
    'diamond': 'brilliant-cut diamond',
    'ruby': 'natural ruby gemstone',
    'sapphire': 'natural sapphire gemstone',
    'emerald': 'natural emerald gemstone',
    'amethyst': 'natural amethyst gemstone',
    'none': '',
  };

  // Type-specific descriptions
  const typeDescriptions: Record<JewelryType, string> = {
    'ring': 'elegant ring',
    'necklace': 'sophisticated necklace',
    'bracelet': 'delicate bracelet',
    'earring': 'stunning pair of earrings',
    'pendant': 'beautiful pendant',
  };

  // Style modifiers
  const styleModifiers: Record<string, string> = {
    'photorealistic': 'professional product photography, studio lighting, white background, high detail, 4K quality',
    'artistic': 'artistic jewelry photography, dramatic lighting, elegant composition',
    'minimalist': 'minimalist jewelry photography, clean lines, soft shadows, simple background',
  };

  const materialDesc = materialDescriptions[material];
  const gemstoneDesc = gemstone !== 'none' ? gemstoneDescriptions[gemstone] : '';
  const typeDesc = typeDescriptions[type];
  const styleDesc = styleModifiers[style];

  let prompt = `${typeDesc} crafted from ${materialDesc}`;
  
  if (gemstoneDesc) {
    prompt += ` featuring ${gemstoneDesc}`;
  }

  if (customPrompt) {
    prompt += `, ${customPrompt}`;
  }

  prompt += `, ${styleDesc}`;

  return prompt;
}

/**
 * Generate a realistic jewelry image using DALL-E 3
 */
export async function generateJewelryImage(
  params: GenerateJewelryImageParams
): Promise<GenerateJewelryImageResult> {
  try {
    const prompt = buildJewelryPrompt(params);

    console.log('Generating jewelry image with prompt:', prompt);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural',
    });

    const imageUrl = response.data?.[0]?.url;
    const revisedPrompt = response.data?.[0]?.revised_prompt || prompt;

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    return {
      imageUrl,
      revisedPrompt,
    };
  } catch (error) {
    console.error('Error generating jewelry image:', error);
    throw new Error(
      `Failed to generate jewelry image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate multiple jewelry variations
 */
export async function generateJewelryVariations(
  params: GenerateJewelryImageParams,
  count: number = 1
): Promise<GenerateJewelryImageResult[]> {
  const promises = Array.from({ length: count }, () => 
    generateJewelryImage(params)
  );
  
  return Promise.all(promises);
}

