"use client";

import { useStore } from '@/lib/stores/useStore';
import { Design } from '@/lib/types';

export default function AddToCartButton({ product }: { product: Design }) {
  const addToCart = useStore((s: any) => s.addToCart);

  const handleAdd = () => {
    // Ensure createdAt is a Date
    const design = {
      ...product,
      createdAt: new Date(product.createdAt as any),
      // normalize imageUrl so cart items have an image when possible
      imageUrl: (product as any).imageUrl || (product as any).thumbnailUrl || '',
    } as Design;

    addToCart({ design, customization: {}, quantity: 1 });
  };

  return (
    <button onClick={handleAdd} className="px-6 py-3 bg-emerald-500 text-black rounded font-semibold">
      Add to cart
    </button>
  );
}
