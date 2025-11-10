'use client';

import { motion } from 'framer-motion';
import { Heart, Download, Eye, Share2 } from 'lucide-react';
import { Design } from '@/lib/types';
import { formatPrice } from '@/lib/utils/helpers';
import { useStore } from '@/lib/stores/useStore';
import { toast } from 'react-toastify';

interface DesignCardProps {
  design: Design;
  onView?: (design: Design) => void;
}

export default function DesignCard({ design, onView }: DesignCardProps) {
  const { toggleFavorite } = useStore();

  const handleFavorite = () => {
    toggleFavorite(design.id);
    toast.success(design.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleDownload = () => {
    toast.success('Downloading design...');
    // Download logic would go here
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
    // Share logic would go here
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg card-hover"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {/* Placeholder for actual image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">💍</span>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            onClick={() => onView && onView(design)}
            className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye className="w-5 h-5 text-gray-900" />
          </motion.button>

          <motion.button
            onClick={handleDownload}
            className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Download className="w-5 h-5 text-gray-900" />
          </motion.button>

          <motion.button
            onClick={handleShare}
            className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="w-5 h-5 text-gray-900" />
          </motion.button>
        </div>

        {/* Favorite Button */}
        <motion.button
          onClick={handleFavorite}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={`w-5 h-5 ${
              design.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {design.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-full">
            {design.type}
          </span>
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
            {design.material}
          </span>
        </div>

        {design.prompt && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {design.prompt}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
            {formatPrice(design.price)}
          </span>
          
          <motion.button
            onClick={() => onView && onView(design)}
            className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

