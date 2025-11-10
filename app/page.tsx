'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import LuxuryHero from '@/components/hero/LuxuryHero';
import { Wand2, Gem, Eye, Download } from 'lucide-react';

export default function HomePage() {

  const features = [
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: 'AI Design Generator',
      description: 'Transform your ideas into stunning jewelry designs with advanced AI technology',
      gradient: 'from-emerald-400 to-emerald-600',
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: 'Custom Materials',
      description: 'Choose from premium gold, silver, platinum and precious gemstones',
      gradient: 'from-emerald-500 to-emerald-700',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Virtual Try-On',
      description: 'Experience your designs in AR before bringing them to life',
      gradient: 'from-emerald-600 to-emerald-800',
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: '3D Export',
      description: 'Download production-ready CAD files for manufacturing',
      gradient: 'from-emerald-400 to-emerald-700',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <LuxuryHero />

      {/* How It Works Section */}
      <section className="relative py-24 bg-gradient-to-b from-white to-emerald-50/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create stunning jewelry designs in three simple steps
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative rounded-xl p-6 bg-gradient-to-b from-emerald-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center text-black mb-4 group-hover:scale-105 transition-transform`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-bold text-ivory mb-2 font-playfair">
                  {feature.title}
                </h3>
                <p className="text-sm text-ivory-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-4">
              Inspiration Gallery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Explore stunning jewelry designs created by our community
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
              'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80',
              'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80',
            ].map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="aspect-square rounded-lg overflow-hidden border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
              >
                <img
                  src={src}
                  alt={`Jewelry design ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/gallery">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 backdrop-blur-md rounded-xl border border-emerald-500/30 text-gray-900 font-semibold hover:border-emerald-500/50 hover:bg-emerald-50 transition-all"
              >
                View Full Gallery
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-b from-emerald-50/10 to-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-4">
              Ready to Create?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Start designing your dream jewelry piece today
            </p>
            
            <Link href="/design">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold text-base rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
              >
                Start Designing Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
