"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import { JEWELRY_TYPES } from '@/lib/utils/constants';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminProductsPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('ring');
  const [material, setMaterial] = useState('gold');
  const [gemstone, setGemstone] = useState('none');
  const [price, setPrice] = useState('0');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let base64Image: string | undefined = undefined;
      if (file) {
        base64Image = await fileToBase64(file);
      }

      const payload: any = {
        name,
        type,
        material,
        gemstone,
        price,
      };

      if (base64Image) payload.base64Image = base64Image;
      else if (imageUrl) payload.imageUrl = imageUrl;

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to create product');
      }

      toast.success('Product added successfully');
      // Reset form
      setName('');
      setPrice('0');
      setImageUrl('');
      setFile(null);
    } catch (err: any) {
      console.error('Create product failed', err);
      toast.error(err?.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Admin — Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input className="w-full p-3 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Type</label>
            <select className="w-full p-3 border rounded" value={type} onChange={(e) => setType(e.target.value)}>
              {JEWELRY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Material</label>
            <select className="w-full p-3 border rounded" value={material} onChange={(e) => setMaterial(e.target.value)}>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="platinum">Platinum</option>
              <option value="rose-gold">Rose Gold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Gemstone</label>
          <select className="w-full p-3 border rounded" value={gemstone} onChange={(e) => setGemstone(e.target.value)}>
            <option value="none">None</option>
            <option value="diamond">Diamond</option>
            <option value="ruby">Ruby</option>
            <option value="sapphire">Sapphire</option>
            <option value="emerald">Emerald</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Price (USD)</label>
          <input type="number" step="0.01" min="0" className="w-full p-3 border rounded" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input className="w-full p-3 border rounded" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          <p className="text-sm text-gray-500 mt-1">Or upload a photo below — uploaded images will be uploaded to Cloudinary.</p>
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
        </div>

        <div>
          <button disabled={isSubmitting} className="px-6 py-3 bg-emerald-500 text-black rounded font-semibold">
            {isSubmitting ? 'Saving...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
