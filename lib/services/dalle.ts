import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateJewelryImage(
  description: string,
  type: string = 'ring',
  style: string = 'modern'
) {
  try {
    // Enhance the prompt for better jewelry photography results
    const enhancedPrompt = `Professional product photography of ${description}. 
    ${type}, ${style} style, white background, studio lighting, 
    high-end jewelry photography, hyper-realistic, 8k quality, 
    centered composition, sharp focus, elegant presentation, 
    luxury jewelry, professional commercial photography, no text or watermarks`;

    console.log('Generating image with DALL-E 3:', enhancedPrompt.slice(0, 100) + '...');

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard", // Use "hd" for higher quality (costs more)
      style: "natural", // "natural" or "vivid"
    });

    const imageUrl = response.data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    console.log('✅ DALL-E image generated successfully');

    return {
      success: true,
      imageUrl: imageUrl,
      revisedPrompt: response.data?.[0]?.revised_prompt || '',
    };
  } catch (error) {
    console.error('DALL-E Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image',
      imageUrl: null,
    };
  }
}

// Generate multiple images in parallel (use carefully - costs add up!)
export async function generateMultipleImages(
  descriptions: string[],
  type: string = 'ring',
  style: string = 'modern'
) {
  const results = await Promise.allSettled(
    descriptions.map(desc => generateJewelryImage(desc, type, style))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled' && result.value.success) {
      return result.value.imageUrl;
    }
    // Fallback to placeholder if generation fails
    return `/images/placeholder-${index + 1}.jpg`;
  });
}

// Download and save image (optional - for caching)
export async function downloadImage(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    // You would save this to your storage (S3, Cloudinary, etc.)
    // For now, just return the URL
    return imageUrl;
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
}

