'use client';

import { useState, useEffect } from 'react';
import JewelryGallery from '@/components/gallery/JewelryGallery';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ left: string; top: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    const list = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setParticles(list);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 relative overflow-hidden">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-50/10 via-white to-white" />
      
      {/* Animated Background Particles - Only render on client */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-pulse"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative z-10">
        <JewelryGallery />
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!bg-white !border !border-emerald-500/20 backdrop-blur-xl !text-gray-900"
      />
    </div>
  );
}
