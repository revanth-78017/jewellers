'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Loader2, Sparkles, Download, Heart, Wand2 } from 'lucide-react';
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

export default function LuxuryDesignGenerator() {
  const [selectedType, setSelectedType] = useState<JewelryType>('ring');
  const [selectedMaterial, setSelectedMaterial] = useState<Material>('gold');
  const [selectedGemstone, setSelectedGemstone] = useState<Gemstone>('diamond');
  const [customPrompt, setCustomPrompt] = useState('');
  const [style, setStyle] = useState<'photorealistic' | 'artistic' | 'minimalist'>('photorealistic');
  const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null);
  
  const { isGenerating, setIsGenerating, addGeneratedImage, addDesign } = useStore();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
      });
    }
  }, []);

  const handleGenerate = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    toast.info('Generating your luxury jewelry design...');

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

      // Parse JSON safely — avoid 'Unexpected token <' if the server returned HTML
      let result: any;
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try {
          result = await response.json();
        } catch (err) {
          const text = await response.text();
          throw new Error(`Invalid JSON response from server: ${text.slice(0,200)}`);
        }
      } else {
        const text = await response.text();
        throw new Error(`Expected JSON but server returned: ${text.slice(0,200)}`);
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
      toast.error(error instanceof Error ? error.message : 'Failed to generate design');
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
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1
          ref={titleRef}
          className="text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-4"
        >
          AI Design Studio
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Craft your perfect jewelry piece with artificial intelligence
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20"
          style={{
            background: 'var(--glass-bg)',
          }}
        >
          {/* Jewelry Type */}
          <div>
            <label className="block text-base font-semibold mb-4 text-gray-900">Jewelry Type</label>
            <div className="grid grid-cols-3 gap-3">
              {JEWELRY_TYPES.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type.id as JewelryType)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedType === type.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-emerald-500/20 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-xs font-semibold text-gray-900">{type.name}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div>
            <label className="block text-base font-semibold mb-4 text-gray-900">Material</label>
            <div className="grid grid-cols-2 gap-3">
              {MATERIALS.map((material) => (
                <motion.button
                  key={material.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMaterial(material.id)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selectedMaterial === material.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-emerald-500/20 hover:border-emerald-500/40'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: material.color }}
                  />
                  <span className="text-sm font-semibold text-gray-900">{material.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Gemstone */}
          <div>
            <label className="block text-base font-semibold mb-4 text-gray-900">Gemstone</label>
            <div className="grid grid-cols-2 gap-3">
              {GEMSTONES.map((gemstone) => (
                <motion.button
                  key={gemstone.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGemstone(gemstone.id)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selectedGemstone === gemstone.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-emerald-500/20 hover:border-emerald-500/40'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: gemstone.color }}
                  />
                  <span className="text-sm font-semibold text-gray-900">{gemstone.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-base font-semibold mb-4 text-gray-900">Style</label>
            <div className="grid grid-cols-3 gap-3">
              {(['photorealistic', 'artistic', 'minimalist'] as const).map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStyle(s)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    style === s
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-emerald-500/20 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="text-sm font-semibold capitalize text-gray-900">{s}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-base font-semibold mb-4 text-gray-900">
              Custom Description (Optional)
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your vision: vintage-inspired, Art Deco patterns, intricate filigree..."
              className="w-full p-4 border-2 border-emerald-500/20 rounded-xl resize-none focus:border-emerald-500 focus:outline-none bg-white text-gray-900 placeholder-gray-400 shadow-lg"
              rows={4}
            />
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Creating Magic...</span>
              </>
            ) : (
              <>
                <Wand2 size={24} />
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
          <div className="aspect-square backdrop-blur-xl rounded-2xl overflow-hidden flex items-center justify-center border-2 border-emerald-500/20 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />

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
                    rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                >
                  <Sparkles className="mx-auto text-emerald-400" size={64} />
                </motion.div>
                <div>
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    Crafting Your Masterpiece
                  </p>
                  <p className="text-gray-600">
                    AI is designing your perfect piece...
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 relative z-10 p-8">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveDesign}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Heart size={20} />
                  Save Design
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex-1 py-4 backdrop-blur-xl rounded-xl border-2 border-emerald-500/30 hover:border-emerald-500 text-gray-900 font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--glass-bg)',
                  }}
                >
                  <Download size={20} />
                  Download
                </motion.button>
              </div>

              <div className="p-6 backdrop-blur-xl rounded-xl border-2 border-emerald-500/20">
                <p className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                  ✨ AI Interpretation
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
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

