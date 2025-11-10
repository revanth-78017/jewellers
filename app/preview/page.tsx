'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import { Material, Gemstone, JewelryType } from '@/lib/types';
import { MATERIALS, GEMSTONES, JEWELRY_TYPES } from '@/lib/utils/constants';
import { toast } from 'react-toastify';

// Dynamic import for Three.js component to avoid SSR issues
const ThreeDViewer = dynamic(
  () => import('@/components/preview/ThreeDViewer'),
  { ssr: false }
);

export default function PreviewPage() {
  const [jewelryType, setJewelryType] = useState<JewelryType>('ring');
  const [material, setMaterial] = useState<Material>('gold');
  const [gemstone, setGemstone] = useState<Gemstone>('diamond');

  const selectedMaterial = MATERIALS.find(m => m.id === material);
  const selectedGemstone = GEMSTONES.find(g => g.id === gemstone);

  const handleExport = () => {
    toast.success('Exporting 3D model...');
    // Export logic would go here
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
    // Share logic would go here
  };

  const handleReset = () => {
    setJewelryType('ring');
    setMaterial('gold');
    setGemstone('diamond');
    toast.info('View reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            3D Preview
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Interact with your design in stunning 3D
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ThreeDViewer
                type={jewelryType}
                color={selectedMaterial?.color}
                gemstoneColor={selectedGemstone?.color}
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4 mt-6"
            >
              <Button
                onClick={handleExport}
                variant="primary"
                icon={<Download className="w-5 h-5" />}
              >
                Export CAD
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                icon={<Share2 className="w-5 h-5" />}
              >
                Share
              </Button>
              <Button
                onClick={handleReset}
                variant="ghost"
                icon={<RotateCcw className="w-5 h-5" />}
              >
                Reset View
              </Button>
            </motion.div>
          </div>

          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg h-fit"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Customize View
            </h2>

            {/* Jewelry Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Jewelry Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {JEWELRY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setJewelryType(type.id as JewelryType)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      jewelryType === type.id
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {type.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Material
              </label>
              <div className="space-y-2">
                {MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setMaterial(mat.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      material === mat.id
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ background: mat.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gemstone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Gemstone
              </label>
              <div className="space-y-2">
                {GEMSTONES.map((gem) => (
                  <button
                    key={gem.id}
                    onClick={() => setGemstone(gem.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      gemstone === gem.id
                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ background: gem.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {gem.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Estimate */}
            <div className="mt-8 p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Estimated Price
              </p>
              <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                ${(1000 * (selectedMaterial?.priceMultiplier || 1) * (1 + (selectedGemstone?.priceMultiplier || 0))).toFixed(2)}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

