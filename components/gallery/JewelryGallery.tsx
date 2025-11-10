'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, Filter, ExternalLink } from 'lucide-react';
import { JewelryType } from '@/lib/types';
import { JEWELRY_TYPES } from '@/lib/utils/constants';
import { useStore } from '@/lib/stores/useStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  description: string | null;
  photographer: string;
  photographerUrl: string;
  downloadLocation: string;
  // If this image represents an admin product
  isProduct?: boolean;
  price?: number;
  productId?: string;
}

export default function JewelryGallery() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<JewelryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showOnlyProducts, setShowOnlyProducts] = useState(false);

  const { setGalleryImages } = useStore();

  const fetchImages = async (type?: JewelryType | 'all', query?: string, pageNum: number = 1, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const params = new URLSearchParams();
      if (type && type !== 'all') params.append('type', type as JewelryType);
      if (query) params.append('query', query);
      params.append('count', '24'); // Increased from 12 to 24
      params.append('page', pageNum.toString());

      const response = await fetch(`/api/gallery?${params.toString()}`);

      // Parse JSON safely — if the server returned HTML (error page) this will surface a helpful message
      let result: any;
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try {
          result = await response.json();
        } catch (err) {
          const text = await response.text();
          throw new Error(`Invalid JSON response from /api/gallery: ${text.slice(0,200)}`);
        }
      } else {
        const text = await response.text();
        throw new Error(`Expected JSON from /api/gallery but server returned: ${text.slice(0,200)}`);
      }

      // Check if HTTP response is not OK
      if (!response.ok) {
        throw new Error(result?.error || `HTTP ${response.status}: Failed to fetch images`);
      }

      // Check if API returned an error
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to fetch images');
      }

      const newImages = result.data.images;

      if (showOnlyProducts && !append) {
        // Fetch only admin products and show them (client-side filtering by type/query)
        try {
          const prodRes = await fetch('/api/products');

          // Parse admin products response safely
          let prodJson: any;
          const ct2 = prodRes.headers.get('content-type') || '';
          if (ct2.includes('application/json')) {
            try {
              prodJson = await prodRes.json();
            } catch (err) {
              const text = await prodRes.text();
              throw new Error(`Invalid JSON response from /api/products: ${text.slice(0,200)}`);
            }
          } else {
            const text = await prodRes.text();
            throw new Error(`Expected JSON from /api/products but server returned: ${text.slice(0,200)}`);
          }

          if (prodRes.ok && prodJson.success && Array.isArray(prodJson.data.products)) {
            const PLACEHOLDER = 'https://via.placeholder.com/600?text=No+Image';
            let adminList = prodJson.data.products as any[];

            // Filter by selectedType if set
            if (type && type !== 'all') {
              adminList = adminList.filter((p) => p.type === type);
            }

            // Filter by search query against name
            if (query) {
              const q = query.toLowerCase();
              adminList = adminList.filter((p) => (p.name || '').toLowerCase().includes(q));
            }

            const adminProducts = adminList.map((p: any) => ({
              id: p.id,
              url: p.imageUrl || PLACEHOLDER,
              thumbnailUrl: p.imageUrl || PLACEHOLDER,
              description: p.name || null,
              photographer: 'Shop',
              photographerUrl: '/admin/products',
              downloadLocation: '',
              isProduct: true,
              price: p.price,
              productId: p.id,
            }));

            setImages(adminProducts);
            setGalleryImages(adminProducts);
            setHasMore(false);
          } else {
            setImages([]);
            setGalleryImages([]);
            setHasMore(false);
          }
        } catch (err) {
          console.warn('Failed to fetch admin products', err);
          setImages([]);
          setGalleryImages([]);
          setHasMore(false);
        }
      } else if (append) {
        // When loading more, only append Unsplash/gallery images (admin products stay at top)
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        setGalleryImages(updatedImages);
      } else {
        // On initial / non-append load, try to fetch admin products and prepend them
        try {
          const prodRes = await fetch('/api/products');
          const prodJson = await prodRes.json();
          if (prodRes.ok && prodJson.success && Array.isArray(prodJson.data.products)) {
            const PLACEHOLDER = 'https://via.placeholder.com/600?text=No+Image';
            const adminProducts = prodJson.data.products.map((p: any) => ({
              id: p.id,
              url: p.imageUrl || PLACEHOLDER,
              thumbnailUrl: p.imageUrl || PLACEHOLDER,
              description: p.name || null,
              photographer: 'Shop',
              photographerUrl: '/admin/products',
              downloadLocation: '',
              isProduct: true,
              price: p.price,
              productId: p.id,
            }));

            const merged = [...adminProducts, ...newImages];
            setImages(merged);
            setGalleryImages(merged);
          } else {
            setImages(newImages);
            setGalleryImages(newImages);
          }
        } catch (err) {
          console.warn('Failed to fetch admin products', err);
          setImages(newImages);
          setGalleryImages(newImages);
        }
      }

      // Check if there are more images to load
      setHasMore(newImages.length === 24);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Failed to load gallery images');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchImages(selectedType === 'all' ? undefined : selectedType, searchQuery, 1, false);
  }, [selectedType, showOnlyProducts, searchQuery]);

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    fetchImages(
      selectedType === 'all' ? undefined : selectedType,
      searchQuery,
      1,
      false
    );
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(
      selectedType === 'all' ? undefined : selectedType,
      searchQuery,
      nextPage,
      true
    );
  };

  // Infinite scroll observer
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 500 &&
        !isLoading &&
        !isLoadingMore &&
        hasMore
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, isLoadingMore, hasMore, page, selectedType, searchQuery]);

  const handleImageClick = async (image: GalleryImage) => {
    // If this is an admin product, navigate to the product detail page
    if (image.isProduct && image.productId) {
      router.push(`/products/view?id=${image.productId}`);
      return;
    }

    // Otherwise open the image modal
    setSelectedImage(image);

    // Track photo download as per Unsplash API requirements for gallery images
    try {
      if (!image.isProduct) {
        await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            downloadLocation: image.downloadLocation,
          }),
        });
      }
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl lg:text-6xl font-playfair font-bold mb-4 text-gray-900">
          Luxury Gallery
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore exquisite jewelry designs from around the world
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 space-y-6"
      >
        {/* Type Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              selectedType === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-lg shadow-emerald-500/50'
                : 'backdrop-blur-xl border border-emerald-500/20 text-gray-900 hover:border-emerald-500/40'
            }`}
            style={selectedType !== 'all' ? { background: 'var(--glass-bg)' } : {}}
          >
            All Jewelry
          </motion.button>
          {JEWELRY_TYPES.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedType(type.id as JewelryType)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedType === type.id
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-lg shadow-emerald-500/50'
                  : 'backdrop-blur-xl border border-emerald-500/20 text-gray-900 hover:border-emerald-500/40'
              }`}
              style={selectedType !== type.id ? { background: 'var(--glass-bg)' } : {}}
            >
              <span className="mr-2">{type.icon}</span>
              {type.name}
            </motion.button>
          ))}
        </div>

        {/* Show only products toggle */}
        <div className="flex items-center justify-center mt-4">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnlyProducts}
              onChange={(e) => {
                setShowOnlyProducts(e.target.checked);
                // refresh listing
                setPage(1);
                setHasMore(true);
                fetchImages(selectedType === 'all' ? undefined : selectedType, searchQuery, 1, false);
              }}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Show only products</span>
          </label>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400" size={22} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for diamond rings, gold necklaces, and more..."
              className="w-full pl-12 pr-4 py-4 border-2 border-emerald-500/20 rounded-xl focus:border-emerald-500 focus:outline-none bg-white shadow-lg text-lg text-gray-900 placeholder-gray-400"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-xl font-bold hover:shadow-2xl transition-all shadow-lg"
          >
            Search
          </motion.button>
        </div>
      </motion.div>

      {/* Gallery Grid */}
      {isLoading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-32"
        >
          <div className="text-center space-y-6">
            <Loader2 className="animate-spin mx-auto text-emerald-400" size={64} />
            <p className="text-xl text-ivory-300 font-medium">Loading beautiful jewelry...</p>
          </div>
        </motion.div>
      ) : images.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full backdrop-blur-xl border border-emerald-500/20 mb-6" style={{ background: 'var(--glass-bg)' }}>
            <Search className="w-12 h-12 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-playfair font-bold text-ivory mb-2">No Results Found</h3>
          <p className="text-ivory-300 text-lg">
            Try adjusting your search or browse all jewelry
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -8 }}
              className="group relative aspect-square bg-white rounded-2xl overflow-hidden cursor-pointer border border-emerald-500/20 hover:border-emerald-500/40 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all"
              onClick={() => handleImageClick(image)}
            >
              {image.isProduct && (
                <div className="absolute top-3 left-3 z-20">
                  <div className="bg-emerald-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                    {`Product • $${image.price ?? ''}`}
                  </div>
                </div>
              )}
              <img
                src={image.thumbnailUrl}
                alt={image.description || 'Jewelry image'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-base font-semibold mb-2 line-clamp-2">
                    {image.description || 'Beautiful jewelry design'}
                  </p>
                  <p className="text-sm text-emerald-400">by {image.photographer}</p>
                </div>
              </div>
              {/* Decorative corner */}
              <div className="absolute top-3 right-3 w-10 h-10 backdrop-blur-xl border border-emerald-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-emerald-400" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More Indicator */}
      {!isLoading && images.length > 0 && (
        <div className="mt-12 flex justify-center">
          {isLoadingMore ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-emerald-400"
            >
              <Loader2 className="animate-spin" size={32} />
              <span className="text-lg font-medium">Loading more jewelry...</span>
            </motion.div>
          ) : hasMore ? (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all"
            >
              Load More Designs
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl border border-emerald-500/20" style={{ background: 'var(--glass-bg)' }}>
                <span className="text-emerald-400">✦</span>
                <span className="text-gray-600 font-medium">You've reached the end of the gallery</span>
                <span className="text-emerald-400">✦</span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-8">
              <img
                src={selectedImage.url}
                alt={selectedImage.description || 'Jewelry image'}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
            <div className="p-8 border-t dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <p className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {selectedImage.description || 'Beautiful jewelry design'}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  📸 Photo by <span className="font-semibold">{selectedImage.photographer}</span>
                </p>
                <a
                  href={selectedImage.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View on Unsplash
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center transition-all group"
            >
              <span className="text-white text-2xl group-hover:rotate-90 transition-transform duration-300">✕</span>
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Unsplash Attribution */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Images from{' '}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}

