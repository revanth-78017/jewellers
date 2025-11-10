// API route for generating jewelry designs with AI

import { NextRequest, NextResponse } from 'next/server';
import { generateJewelryImage } from '@/lib/services/imageGeneration';
import { uploadImageFromUrl } from '@/lib/services/imageStorage';
import { JewelryType, Material, Gemstone } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for AI generation

interface GenerateDesignRequest {
  type: JewelryType;
  material: Material;
  gemstone: Gemstone;
  customPrompt?: string;
  style?: 'photorealistic' | 'artistic' | 'minimalist';
  saveToCloud?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDesignRequest = await request.json();
    const { type, material, gemstone, customPrompt, style, saveToCloud = true } = body;

    // Validate required fields
    if (!type || !material || !gemstone) {
      return NextResponse.json(
        { error: 'Missing required fields: type, material, gemstone' },
        { status: 400 }
      );
    }

    // Generate jewelry image with DALL-E
    console.log('Generating jewelry design:', { type, material, gemstone });
    
    const result = await generateJewelryImage({
      type,
      material,
      gemstone,
      customPrompt,
      style,
    });

    let cloudinaryUrl = result.imageUrl;
    let cloudinaryPublicId: string | undefined;

    // Optionally upload to Cloudinary for permanent storage
    if (saveToCloud && process.env.CLOUDINARY_API_KEY) {
      try {
        const uploadResult = await uploadImageFromUrl({
          imageUrl: result.imageUrl,
          folder: 'jewelry-designs',
          tags: [type, material, gemstone],
        });
        
        cloudinaryUrl = uploadResult.secureUrl;
        cloudinaryPublicId = uploadResult.publicId;
        
        console.log('Uploaded to Cloudinary:', cloudinaryPublicId);
      } catch (uploadError) {
        console.error('Failed to upload to Cloudinary:', uploadError);
        // Continue with DALL-E URL if Cloudinary upload fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: cloudinaryUrl,
        originalUrl: result.imageUrl,
        publicId: cloudinaryPublicId,
        revisedPrompt: result.revisedPrompt,
        type,
        material,
        gemstone,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in generate-design API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate design',
      },
      { status: 500 }
    );
  }
}

// GET method to check API status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Design generation API is running',
    endpoints: {
      POST: 'Generate a new jewelry design',
    },
  });
}
