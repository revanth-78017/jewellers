import { NextResponse } from 'next/server';
import { readProducts, addProduct } from '@/lib/services/productStore';
import { uploadBase64Image, uploadImageFromUrl } from '@/lib/services/imageStorage';
import { Design } from '@/lib/types';

// GET /api/products
export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json({ success: true, data: { products } }, { status: 200 });
  } catch (error) {
    console.error('GET /api/products error', error);
    return NextResponse.json({ success: false, error: 'Failed to read products' }, { status: 500 });
  }
}

// POST /api/products
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      type = 'ring',
      material = 'gold',
      gemstone = 'none',
      price,
      description = '',
      imageUrl,
      base64Image,
    } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name or price' }, { status: 400 });
    }

    let finalImageUrl = imageUrl || '';

    // If base64 provided, upload it
    if (base64Image) {
      try {
        const uploaded = await uploadBase64Image(base64Image);
        finalImageUrl = uploaded.secureUrl || uploaded.url;
      } catch (err) {
        console.error('Base64 upload failed:', err);
        // fall through to use provided imageUrl if present
      }
    } else if (imageUrl) {
      // Try to upload remote URL to Cloudinary so we control assets; if it fails, keep original URL
      try {
        const uploaded = await uploadImageFromUrl({ imageUrl });
        finalImageUrl = uploaded.secureUrl || uploaded.url;
      } catch (err) {
        console.warn('Uploading remote image failed, using provided URL as-is', err);
      }
    }

    const newProduct: Design = {
      id: (globalThis.crypto && (globalThis.crypto as any).randomUUID ? (globalThis.crypto as any).randomUUID() : Date.now().toString()),
      name,
      type,
      material,
      gemstone,
      imageUrl: finalImageUrl,
      prompt: undefined,
      modelUrl: undefined,
      price: Number(price),
      createdAt: new Date(),
    } as unknown as Design;

    const created = await addProduct(newProduct);

    return NextResponse.json({ success: true, data: { product: created } }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
