'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { FilterOptions, JewelryType, Material, Gemstone } from '@/lib/types';
import { MATERIALS, GEMSTONES, JEWELRY_TYPES } from '@/lib/utils/constants';
import Button from '@/components/ui/Button';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleType = (type: JewelryType) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFiltersChange({ ...filters, type: newTypes });
  };

  const toggleMaterial = (material: Material) => {
    const currentMaterials = filters.material || [];
    const newMaterials = currentMaterials.includes(material)
      ? currentMaterials.filter(m => m !== material)
      : [...currentMaterials, material];
    onFiltersChange({ ...filters, material: newMaterials });
  };

  const toggleGemstone = (gemstone: Gemstone) => {
    const currentGemstones = filters.gemstone || [];
    const newGemstones = currentGemstones.includes(gemstone)
      ? currentGemstones.filter(g => g !== gemstone)
      : [...currentGemstones, gemstone];
    onFiltersChange({ ...filters, gemstone: newGemstones });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = 
    (filters.type?.length || 0) +
    (filters.material?.length || 0) +
    (filters.gemstone?.length || 0);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          icon={<Filter className="w-5 h-5" />}
        >
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {(isOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed lg:sticky top-20 left-0 z-30 h-[calc(100vh-5rem)] lg:h-auto w-80 lg:w-full bg-white dark:bg-gray-800 shadow-xl lg:shadow-none rounded-r-2xl lg:rounded-2xl p-6 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Filters
              </h3>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Jewelry Type */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Type
              </h4>
              <div className="space-y-2">
                {JEWELRY_TYPES.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.type?.includes(type.id as JewelryType)}
                      onChange={() => toggleType(type.id as JewelryType)}
                      className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Material
              </h4>
              <div className="space-y-2">
                {MATERIALS.map((material) => (
                  <label
                    key={material.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.material?.includes(material.id)}
                      onChange={() => toggleMaterial(material.id)}
                      className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ background: material.color }}
                      />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                        {material.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Gemstone */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Gemstone
              </h4>
              <div className="space-y-2">
                {GEMSTONES.map((gemstone) => (
                  <label
                    key={gemstone.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.gemstone?.includes(gemstone.id)}
                      onChange={() => toggleGemstone(gemstone.id)}
                      className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ background: gemstone.color }}
                      />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                        {gemstone.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Sort By
              <select
                value={filters.sortBy || 'date'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onFiltersChange({
                    ...filters,
                    sortBy: e.target.value as 'date' | 'price-asc' | 'price-desc' | 'popular',
                  })
              }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="date">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}
    </>
  );
}

