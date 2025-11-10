// Unsplash service for fetching real jewelry photos

import { createApi } from 'unsplash-js';
import { JewelryType } from '@/lib/types';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
});

interface FetchJewelryImagesParams {
  type?: JewelryType;
  count?: number;
  query?: string;
}

interface JewelryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  description: string | null;
  photographer: string;
  photographerUrl: string;
  downloadLocation: string;
}

/**
 * Map jewelry types to Unsplash search queries
 */
function getSearchQuery(type?: JewelryType, customQuery?: string): string {
  if (customQuery) {
    return `${customQuery} jewelry`;
  }

  const queries: Record<JewelryType, string> = {
    'ring': 'gold ring jewelry',
    'necklace': 'necklace jewelry',
    'bracelet': 'bracelet jewelry',
    'earring': 'earrings jewelry',
    'pendant': 'pendant jewelry',
  };

  return type ? queries[type] : 'luxury jewelry';
}

/**
 * Fetch real jewelry images from Unsplash
 */
export async function fetchJewelryImages(
  params: FetchJewelryImagesParams = {}
): Promise<JewelryImage[]> {
  const { type, count = 10, query } = params;

  try {
    const searchQuery = getSearchQuery(type, query);

    console.log('Fetching jewelry images from Unsplash:', searchQuery);

    const result = await unsplash.search.getPhotos({
      query: searchQuery,
      page: 1,
      perPage: count,
      orientation: 'squarish',
    });

    if (result.errors) {
      throw new Error(result.errors[0]);
    }

    if (!result.response) {
      throw new Error('No response from Unsplash');
    }

    const images: JewelryImage[] = result.response.results.map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.small,
      description: photo.description || photo.alt_description,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      downloadLocation: photo.links.download_location,
    }));

    return images;
  } catch (error) {
    console.error('Error fetching jewelry images from Unsplash:', error);
    throw new Error(
      `Failed to fetch jewelry images: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Track photo download (required by Unsplash API guidelines)
 */
export async function trackPhotoDownload(downloadLocation: string): Promise<void> {
  try {
    await fetch(downloadLocation, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error tracking photo download:', error);
  }
}

/**
 * Fetch a random jewelry image
 */
export async function fetchRandomJewelryImage(type?: JewelryType): Promise<JewelryImage | null> {
  try {
    const searchQuery = getSearchQuery(type);

    const result = await unsplash.photos.getRandom({
      query: searchQuery,
      count: 1,
    });

    if (result.errors) {
      throw new Error(result.errors[0]);
    }

    if (!result.response || !Array.isArray(result.response)) {
      throw new Error('Invalid response from Unsplash');
    }

    const photo = result.response[0];

    return {
      id: photo.id,
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.small,
      description: photo.description || photo.alt_description,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      downloadLocation: photo.links.download_location,
    };
  } catch (error) {
    console.error('Error fetching random jewelry image:', error);
    return null;
  }
}

