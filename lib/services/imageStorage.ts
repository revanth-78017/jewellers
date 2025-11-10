// Cloudinary service for image storage and optimization

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadImageParams {
  imageUrl: string;
  folder?: string;
  publicId?: string;
  tags?: string[];
}

interface UploadImageResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
}

interface OptimizeImageParams {
  publicId: string;
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'jpg' | 'png' | 'webp';
}

/**
 * Upload an image to Cloudinary from a URL
 */
export async function uploadImageFromUrl(
  params: UploadImageParams
): Promise<UploadImageResult> {
  const { imageUrl, folder = 'jewelry-designs', publicId, tags = [] } = params;

  try {
    console.log('Uploading image to Cloudinary:', imageUrl);

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      public_id: publicId,
      tags: ['jewelry', ...tags],
      resource_type: 'image',
      overwrite: false,
    });

    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error(
      `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Upload a base64 image to Cloudinary
 */
export async function uploadBase64Image(
  base64Image: string,
  folder: string = 'jewelry-designs',
  publicId?: string
): Promise<UploadImageResult> {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
      public_id: publicId,
      tags: ['jewelry'],
      resource_type: 'image',
    });

    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Error uploading base64 image to Cloudinary:', error);
    throw new Error(
      `Failed to upload base64 image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get optimized image URL from Cloudinary
 */
export function getOptimizedImageUrl(params: OptimizeImageParams): string {
  const {
    publicId,
    width,
    height,
    quality = 'auto',
    format = 'auto',
  } = params;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured');
    return '';
  }

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  transformations.push('c_limit'); // Maintain aspect ratio

  const transformString = transformations.join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Generate thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size: number = 300): string {
  return getOptimizedImageUrl({
    publicId,
    width: size,
    height: size,
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}

/**
 * Get image details from Cloudinary
 */
export async function getImageDetails(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error getting image details from Cloudinary:', error);
    throw new Error(
      `Failed to get image details: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

