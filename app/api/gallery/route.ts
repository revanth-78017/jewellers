// API route for fetching jewelry gallery images using Tavily

import { NextRequest, NextResponse } from 'next/server';
import { JewelryType } from '@/lib/types';
import { searchJewelryByType, searchCustomJewelry } from '@/lib/services/tavily';

export const runtime = 'nodejs';

interface GalleryRequest {
  type?: JewelryType;
  count?: number;
  query?: string;
}

// Fallback curated jewelry images (in case Tavily fails)
const fallbackJewelryImages = [
  // Rings
  { id: '1', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80', type: 'ring', description: 'Elegant diamond engagement ring', photographer: 'Unsplash' },
  { id: '2', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80', type: 'ring', description: 'Golden wedding band with diamonds', photographer: 'Unsplash' },
  { id: '3', url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80', type: 'ring', description: 'Luxury sapphire cocktail ring', photographer: 'Unsplash' },
  { id: '4', url: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80', type: 'ring', description: 'Rose gold diamond ring', photographer: 'Unsplash' },
  
  // Necklaces
  { id: '5', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', type: 'necklace', description: 'Pearl pendant necklace', photographer: 'Unsplash' },
  { id: '6', url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80', type: 'necklace', description: 'Gold chain necklace', photographer: 'Unsplash' },
  { id: '7', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', type: 'necklace', description: 'Diamond pendant necklace', photographer: 'Unsplash' },
  { id: '8', url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=80', type: 'necklace', description: 'Elegant silver necklace', photographer: 'Unsplash' },
  
  // Bracelets
  { id: '9', url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80', type: 'bracelet', description: 'Gold bangle bracelet', photographer: 'Unsplash' },
  { id: '10', url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80', type: 'bracelet', description: 'Diamond tennis bracelet', photographer: 'Unsplash' },
  { id: '11', url: 'https://images.unsplash.com/photo-1588444650738-341fff08ce34?w=800&q=80', type: 'bracelet', description: 'Silver charm bracelet', photographer: 'Unsplash' },
  { id: '12', url: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f42?w=800&q=80', type: 'bracelet', description: 'Luxury gold bracelet', photographer: 'Unsplash' },
  
  // Earrings
  { id: '13', url: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f42?w=800&q=80', type: 'earring', description: 'Diamond stud earrings', photographer: 'Unsplash' },
  { id: '14', url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80', type: 'earring', description: 'Pearl drop earrings', photographer: 'Unsplash' },
  { id: '15', url: 'https://images.unsplash.com/photo-1564494252407-7108f20f82c9?w=800&q=80', type: 'earring', description: 'Gold hoop earrings', photographer: 'Unsplash' },
  { id: '16', url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80', type: 'earring', description: 'Gemstone chandelier earrings', photographer: 'Unsplash' },
  
  // Pendants
  { id: '17', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80', type: 'pendant', description: 'Heart-shaped diamond pendant', photographer: 'Unsplash' },
  { id: '18', url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80', type: 'pendant', description: 'Emerald pendant', photographer: 'Unsplash' },
  
  // Brooches
  { id: '19', url: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80', type: 'brooch', description: 'Vintage diamond brooch', photographer: 'Unsplash' },
  { id: '20', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80', type: 'brooch', description: 'Floral gold brooch', photographer: 'Unsplash' },
  
  // Anklets
  { id: '21', url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80', type: 'anklet', description: 'Delicate gold anklet', photographer: 'Unsplash' },
  { id: '22', url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80', type: 'anklet', description: 'Silver anklet with charms', photographer: 'Unsplash' },
  
  // Watches
  { id: '23', url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80', type: 'watch', description: 'Luxury gold watch', photographer: 'Unsplash' },
  { id: '24', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80', type: 'watch', description: 'Diamond-encrusted watch', photographer: 'Unsplash' },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as JewelryType | null;
    const count = parseInt(searchParams.get('count') || '24', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const query = searchParams.get('query') || undefined;

    console.log('Fetching gallery images via Tavily:', { type, count, page, query });

    type ImageItem = {
      id: string;
      imageUrl?: string;
      url?: string;
      thumbnailUrl?: string;
      description?: string;
      title?: string;
      photographer?: string;
      source?: string;
    };

    let images: ImageItem[] = [];

    // Try fetching from Tavily first
    try {
      if (query) {
        // Custom search query
        images = await searchCustomJewelry(query, count);
      } else if (type) {
        // Search by jewelry type
        images = await searchJewelryByType(type, undefined, undefined, count);
      } else {
        // General jewelry search
        images = await searchCustomJewelry('luxury jewelry collection', count);
      }

      console.log(`Tavily returned ${images.length} images`);
    } catch (tavilyError) {
      console.error('Tavily search failed, using fallback:', tavilyError);
      images = [];
    }

    // Fallback to curated images if Tavily returns nothing
    if (images.length === 0) {
      console.log('Using fallback images');
      let filteredImages = type
        ? fallbackJewelryImages.filter(img => img.type === type)
        : [...fallbackJewelryImages];

      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredImages = filteredImages.filter(img => 
          img.description.toLowerCase().includes(lowerQuery) ||
          img.type.toLowerCase().includes(lowerQuery)
        );
      }

      const shuffled = filteredImages.sort(() => Math.random() - 0.5);
      const selectedImages = shuffled.slice(0, count);

      images = selectedImages.map(img => ({
        id: img.id,
        imageUrl: img.url,
        thumbnailUrl: img.url.replace('w=800', 'w=400'),
        description: img.description,
        photographer: img.photographer,
        photographerUrl: 'https://unsplash.com',
        downloadLocation: '#',
        source: 'fallback',
      }));
    }

    // Format for gallery (ensure consistent structure)
    const formattedImages = images.map(img => ({
      id: img.id,
      url: img.imageUrl || img.url,
      thumbnailUrl: img.thumbnailUrl,
      description: img.description || img.title,
      photographer: img.photographer,
      photographerUrl: img.source || '#',
      downloadLocation: img.source || '#',
    }));

    return NextResponse.json({
      success: true,
      data: {
        images: formattedImages,
        count: formattedImages.length,
        page,
        type,
        query,
        source: images[0]?.source || 'tavily',
      },
    });
  } catch (error) {
    console.error('Error in gallery API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch gallery images',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { downloadLocation } = body;

    if (!downloadLocation) {
      return NextResponse.json(
        { error: 'Missing downloadLocation parameter' },
        { status: 400 }
      );
    }

    // Log download (Tavily doesn't require tracking like Unsplash)
    console.log('Image download tracked:', downloadLocation);

    return NextResponse.json({
      success: true,
      message: 'Download tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track download',
      },
      { status: 500 }
    );
  }
}

