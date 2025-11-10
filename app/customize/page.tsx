'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ShoppingCart, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import { Material, Gemstone, JewelryType } from '@/lib/types';
import { MATERIALS, GEMSTONES, FINISHES } from '@/lib/utils/constants';
import { useStore } from '@/lib/stores/useStore';
import { toast } from 'react-toastify';
import { generateId } from '@/lib/utils/helpers';

const ThreeDViewer = dynamic(
  () => import('@/components/preview/ThreeDViewer'),
  { ssr: false }
);

export default function CustomizePage() {
  const [jewelryType, setJewelryType] = useState<JewelryType>('ring');
  const [material, setMaterial] = useState<Material>('gold');
  const [gemstone, setGemstone] = useState<Gemstone>('diamond');
  const [finish, setFinish] = useState<'polished' | 'matte' | 'brushed'>('polished');
  const [size, setSize] = useState(7);
  const [engraving, setEngraving] = useState('');
  
  const { addDesign, addToCart } = useStore();

  const selectedMaterial = MATERIALS.find(m => m.id === material);
  const selectedGemstone = GEMSTONES.find(g => g.id === gemstone);
  const selectedFinish = FINISHES.find(f => f.id === finish);

  const basePrice = 1000;
  const calculatedPrice = basePrice * 
    (selectedMaterial?.priceMultiplier || 1) * 
    (1 + (selectedGemstone?.priceMultiplier || 0));

  const handleSave = () => {
    const design = {
      id: generateId(),
      name: `Custom ${jewelryType}`,
      type: jewelryType,
      material,
      gemstone,
      imageUrl: '',
      price: calculatedPrice,
      createdAt: new Date(),
      isFavorite: false,
    };
    addDesign(design);
    toast.success('Design saved to your collection!');
  };

  const handleAddToCart = () => {
    const design = {
      id: generateId(),
      name: `Custom ${jewelryType}`,
      type: jewelryType,
      material,
      gemstone,
      imageUrl: '',
      price: calculatedPrice,
      createdAt: new Date(),
      isFavorite: false,
    };
    
    addToCart({
      design,
      customization: {
        size,
        engraving,
        finish,
      },
      quantity: 1,
    });
    
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Custom Designer</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Customize Your Jewelry
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Fine-tune every detail to create your perfect piece
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <div className="sticky top-24">
              <ThreeDViewer
                type={jewelryType}
                color={selectedMaterial?.color}
                gemstoneColor={selectedGemstone?.color}
              />
              
              {/* Summary Card */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Configuration Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {jewelryType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Material:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedMaterial?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gemstone:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedGemstone?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Finish:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {finish}
                    </span>
                  </div>
                  {jewelryType === 'ring' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Size:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {size}
                      </span>
                    </div>
                  )}
                  {engraving && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Engraving:</span>
<span className="font-medium text-gray-900 dark:text-white italic">
                        &quot;{engraving}&quot;
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
                    <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                      ${calculatedPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      variant="outline"
                      icon={<Save className="w-5 h-5" />}
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      variant="primary"
                      icon={<ShoppingCart className="w-5 h-5" />}
                      className="flex-1"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customization Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="order-1 lg:order-2 space-y-6"
          >
            {/* Material Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Material
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setMaterial(mat.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      material === mat.id
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-lg mb-2"
                      style={{ background: mat.color }}
                    />
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {mat.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mat.priceMultiplier}x base
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Gemstone Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Gemstone
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {GEMSTONES.map((gem) => (
                  <button
                    key={gem.id}
                    onClick={() => setGemstone(gem.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      gemstone === gem.id
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-lg mb-2"
                      style={{ background: `radial-gradient(circle, ${gem.color}, ${gem.color}88)` }}
                    />
                    <p className="font-medium text-gray-900 dark:text-white text-xs">
                      {gem.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Finish
              </h3>
              <div className="space-y-2">
                {FINISHES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFinish(f.id as any)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      finish === f.id
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {f.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {f.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection (for rings) */}
            {jewelryType === 'ring' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Ring Size
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="4"
                    max="11"
                    step="0.5"
                    value={size}
                    onChange={(e) => setSize(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-2xl font-bold text-violet-600 dark:text-violet-400 min-w-[3rem] text-center">
                    {size}
                  </span>
                </div>
              </div>
            )}

            {/* Engraving */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Engraving (Optional)
              </h3>
              <input
                type="text"
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                placeholder="Enter text (max 20 characters)"
                maxLength={20}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-violet-500"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {engraving.length}/20 characters
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

