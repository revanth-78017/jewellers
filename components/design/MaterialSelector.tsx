'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Material, Gemstone } from '@/lib/types';
import { MATERIALS, GEMSTONES } from '@/lib/utils/constants';

interface MaterialSelectorProps {
  selectedMaterial: Material;
  selectedGemstone: Gemstone;
  onMaterialChange: (material: Material) => void;
  onGemstoneChange: (gemstone: Gemstone) => void;
}

export default function MaterialSelector({
  selectedMaterial,
  selectedGemstone,
  onMaterialChange,
  onGemstoneChange,
}: MaterialSelectorProps) {
  return (
    <div className="space-y-8">
      {/* Material Selection */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Select Material
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {MATERIALS.map((material) => (
            <motion.button
              key={material.id}
              onClick={() => onMaterialChange(material.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selectedMaterial === material.id
                  ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedMaterial === material.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
              
              <div
                className="w-full h-16 rounded-lg mb-2"
                style={{ background: material.color }}
              />
              
              <p className="text-sm font-medium text-gray-900 dark:text-white text-center">
                {material.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {material.priceMultiplier}x
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Gemstone Selection */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Select Gemstone
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {GEMSTONES.map((gemstone) => (
            <motion.button
              key={gemstone.id}
              onClick={() => onGemstoneChange(gemstone.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selectedGemstone === gemstone.id
                  ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedGemstone === gemstone.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
              
              <div
                className="w-full h-16 rounded-lg mb-2 flex items-center justify-center"
                style={{ background: `radial-gradient(circle, ${gemstone.color}, ${gemstone.color}88)` }}
              >
                {gemstone.id !== 'none' && (
                  <span className="text-2xl">💎</span>
                )}
              </div>
              
              <p className="text-sm font-medium text-gray-900 dark:text-white text-center">
                {gemstone.name}
              </p>
              {gemstone.id !== 'none' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  +{gemstone.priceMultiplier}x
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

