import { readProducts } from '@/lib/services/productStore';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/products/AddToCartButton';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const products = await readProducts();
  const product = products.find((p: any) => p.id === params.id);
  // Debug rendering: show params and whether product found
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Product debug</h2>
      <p>Requested id: <code>{params.id}</code></p>
      <p>Products on disk: {Array.isArray(products) ? products.length : 'unknown'}</p>
      <p>Product found: {product ? 'yes' : 'no'}</p>
      {product && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <img src={product.imageUrl} alt={product.name} className="w-64 h-64 object-contain" />
        </div>
      )}
    </div>
  );
}
