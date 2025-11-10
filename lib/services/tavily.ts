// Tavily API service for web scraping jewelry images

export interface GalleryItem {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  photographer: string;
  source: string;
}

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
}

interface TavilyResponse {
  query: string;
  results: TavilySearchResult[];
  images?: string[];
}

export async function searchJewelryImages(query: string, maxResults: number = 20): Promise<GalleryItem[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.warn('Tavily API key not found');
    return [];
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${query} jewelry high quality images`,
        search_depth: 'advanced',
        include_images: true,
        include_answer: false,
        max_results: Math.min(maxResults, 20),
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    const data: TavilyResponse = await response.json();

    // Extract and format images
    const images = data.images || [];
    
    return images.slice(0, maxResults).map((imageUrl, index) => ({
      id: `tavily-${Date.now()}-${index}`,
      imageUrl,
      thumbnailUrl: imageUrl,
      title: `${query} - Image ${index + 1}`,
      description: data.results[index]?.title || `Beautiful ${query} jewelry design`,
      photographer: data.results[index]?.url ? new URL(data.results[index].url).hostname : 'Web Source',
      source: data.results[index]?.url || imageUrl,
    } as GalleryItem));
  } catch (error) {
    console.error('Error fetching from Tavily:', error);
    return [];
  }
}

import type { JewelryType } from '@/lib/types';

export async function searchJewelryByType(
  type: JewelryType,
  material?: string,
  gemstone?: string,
  maxResults: number = 20
): Promise<GalleryItem[]> {
  let query = type;
  
  if (material) {
    query += ` ${material}`;
  }
  
  if (gemstone) {
    query += ` ${gemstone}`;
  }

  return searchJewelryImages(query, maxResults);
}

export async function searchCustomJewelry(customQuery: string, maxResults: number = 20): Promise<GalleryItem[]> {
  return searchJewelryImages(customQuery, maxResults);
}

