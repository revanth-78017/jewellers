"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AddToCartButton from '@/components/products/AddToCartButton';

export default function ProductViewPage() {
  const search = useSearchParams();
  const id = search.get('id');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch('/api/products')
      .then((r) => r.json())
      .then((json) => {
        const p = (json.data?.products || []).find((x: any) => x.id === id);
        setProduct(p || null);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return <div className="p-8">Missing product id</div>;
  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl overflow-hidden shadow">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-xl text-emerald-600 font-semibold mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">Material: {product.material}</p>
          <p className="text-gray-700 mb-6">{product.prompt || 'Exquisite jewelry piece.'}</p>
          <div className="space-x-4">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
