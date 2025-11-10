'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Download, Heart } from 'lucide-react';
import { JewelryType, Material, Gemstone } from '@/lib/types';
import { MATERIALS, GEMSTONES, JEWELRY_TYPES } from '@/lib/utils/constants';
import { useStore } from '@/lib/stores/useStore';
import { generateId } from '@/lib/utils/helpers';
import { toast } from 'react-toastify';

interface GeneratedDesign {
  imageUrl: string;
  publicId?: string;
  revisedPrompt: string;
}

export default function AIDesignGenerator() {
  const [selectedType, setSelectedType] = useState<JewelryType>('ring');
  const [selectedMaterial, setSelectedMaterial] = useState<Material>('gold');
  const [selectedGemstone, setSelectedGemstone] = useState<Gemstone>('diamond');
  const [customPrompt, setCustomPrompt] = useState('');
  const [style, setStyle] = useState<'photorealistic' | 'artistic' | 'minimalist'>('photorealistic');
  const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null);
  
  const { isGenerating, setIsGenerating, addGeneratedImage, addDesign } = useStore();

  const handleGenerate = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    toast.info('Generating your jewelry design... This may take 15-30 seconds.');

    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          material: selectedMaterial,
          gemstone: selectedGemstone,
          customPrompt: customPrompt || undefined,
          style,
          saveToCloud: true,
        }),
      });

      // Parse JSON safely — if the server returned HTML (error page) this will surface a helpful message
      let result: any;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          result = await response.json();
        } catch (err) {
          const text = await response.text();
          throw new Error(`Invalid JSON response from server: ${text.slice(0, 200)}`);
        }
      } else {
        const text = await response.text();
        throw new Error(`Expected JSON but server returned: ${text.slice(0, 200)}`);
      }

      // Check if HTTP response is not OK
      if (!response.ok) {
        throw new Error(result?.error || `HTTP ${response.status}: Failed to generate design`);
      }

      // Check if API returned an error
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to generate design');
      }

      const design: GeneratedDesign = {
        imageUrl: result.data.imageUrl,
        publicId: result.data.publicId,
        revisedPrompt: result.data.revisedPrompt,
      };

      setGeneratedDesign(design);

      // Add to generated images store
      addGeneratedImage({
        id: generateId(),
        imageUrl: result.data.imageUrl,
        publicId: result.data.publicId,
        revisedPrompt: result.data.revisedPrompt,
        type: selectedType,
        material: selectedMaterial,
        gemstone: selectedGemstone,
        generatedAt: result.data.generatedAt,
      });

      toast.success('Design generated successfully!');
    } catch (error) {
      console.error('Error generating design:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate design. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDesign = () => {
    if (!generatedDesign) return;

    const material = MATERIALS.find(m => m.id === selectedMaterial);
    const gemstone = GEMSTONES.find(g => g.id === selectedGemstone);
    
    const basePrice = 1000;
    const price = basePrice * (material?.priceMultiplier || 1) * (gemstone?.priceMultiplier || 1);

    addDesign({
      id: generateId(),
      name: `${material?.name} ${selectedType} with ${gemstone?.name}`,
      type: selectedType,
      material: selectedMaterial,
      gemstone: selectedGemstone,
      imageUrl: generatedDesign.imageUrl,
      price,
      createdAt: new Date(),
      isFavorite: false,
      prompt: generatedDesign.revisedPrompt,
    });

    toast.success('Design saved to your collection!');
  };

  const handleDownload = async () => {
    if (!generatedDesign) return;

    try {
      const response = await fetch(generatedDesign.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jewelry-design-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
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
        <h1 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          AI Jewelry Designer
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Transform your imagination into stunning jewelry designs with the power of AI
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Design Studio</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configure your perfect piece</p>
            </div>
          </div>

          {/* Jewelry Type */}
          <div>
            <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">Jewelry Type</label>
            <div className="grid grid-cols-3 gap-3">
              {JEWELRY_TYPES.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type.id as JewelryType)}
                  className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                    selectedType === type.id
                      ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 shadow-violet-500/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:shadow-lg bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-xs font-semibold">{type.name}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div>
            <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">Material</label>
            <div className="grid grid-cols-2 gap-3">
              {MATERIALS.map((material) => (
                <motion.button
                  key={material.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMaterial(material.id)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 shadow-md ${
                    selectedMaterial === material.id
                      ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 shadow-violet-500/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:shadow-lg bg-white dark:bg-gray-900'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: material.color }}
                  />
                  <span className="text-sm font-semibold">{material.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Gemstone */}
          <div>
            <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">Gemstone</label>
            <div className="grid grid-cols-2 gap-3">
              {GEMSTONES.map((gemstone) => (
                <motion.button
                  key={gemstone.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGemstone(gemstone.id)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 shadow-md ${
                    selectedGemstone === gemstone.id
                      ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 shadow-violet-500/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:shadow-lg bg-white dark:bg-gray-900'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: gemstone.color }}
                  />
                  <span className="text-sm font-semibold">{gemstone.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">Style</label>
            <div className="grid grid-cols-3 gap-3">
              {(['photorealistic', 'artistic', 'minimalist'] as const).map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStyle(s)}
                  className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                    style === s
                      ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 shadow-violet-500/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:shadow-lg bg-white dark:bg-gray-900'
                  }`}
                >
                  <div className="text-sm font-semibold capitalize">{s}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-base font-semibold mb-3 text-gray-900 dark:text-white">
              Custom Description (Optional)
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., vintage-inspired, with intricate floral patterns and Art Deco elements..."
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:border-violet-500 focus:outline-none dark:bg-gray-900 shadow-md transition-all"
              rows={4}
            />
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Generating Magic...</span>
              </>
            ) : (
              <>
                <Sparkles size={24} />
                <span>Generate Design</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Right Panel - Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-700 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            {generatedDesign ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={generatedDesign.imageUrl}
                alt="Generated jewelry design"
                className="w-full h-full object-cover relative z-10"
              />
            ) : isGenerating ? (
              <div className="text-center space-y-6 relative z-10 p-8">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <Sparkles className="mx-auto text-violet-600" size={64} />
                </motion.div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Creating Your Masterpiece
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our AI is crafting your perfect design...
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 relative z-10 p-8">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles size={64} className="mx-auto mb-6 opacity-30" />
                </motion.div>
                <p className="text-lg font-semibold mb-2">Preview Area</p>
                <p className="text-sm">Your generated design will appear here</p>
              </div>
            )}
          </div>

          {generatedDesign && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveDesign}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Heart size={20} />
                  Save Design
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex-1 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Download size={20} />
                  Download
                </motion.button>
              </div>

              <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border-2 border-violet-200 dark:border-violet-800 shadow-lg">
                <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-2 uppercase tracking-wider">
                  ✨ AI Interpretation
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {generatedDesign.revisedPrompt}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

