'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { JewelryType } from '@/lib/types';

interface TryOnOverlayProps {
  jewelryType: JewelryType;
}

export default function TryOnOverlay({ jewelryType }: TryOnOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        // Request user camera access
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
        setLoading(false);
      } catch (err) {
        console.error('Camera access failed:', err);
        setError('Camera access denied. Please allow permission and reload.');
        setLoading(false);
      }
    };

    enableCamera();

    // Cleanup camera stream on unmount
    return () => {
      const current = (videoRef.current?.srcObject as MediaStream | null) || stream;
      if (current) {
        current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-emerald-500/20 bg-white/70 backdrop-blur-xl">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-full text-emerald-400">
          <Loader2 className="animate-spin w-6 h-6 mb-3" />
          <p>Accessing your camera...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center h-full text-red-400 px-4 text-center">
          <p>{error}</p>
          <p className="text-sm mt-2 text-red-300">
            Ensure your site runs on HTTPS and you’ve allowed camera permission.
          </p>
        </div>
      )}

      {/* Camera Feed + Overlay */}
      {!loading && !error && (
        <div className="relative w-full h-full">
          {/* Mirrored Camera View */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
          />

          {/* Jewelry Overlay (also mirrored) */}
          <motion.img
            key={jewelryType}
            src={`/jewelry/${jewelryType}.png`}
            alt={`${jewelryType} overlay`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 m-auto pointer-events-none opacity-90 max-h-[70%] transform scale-x-[-1]"
          />

          {/* Optional: Capture Button */}
          <button
            onClick={() => {
              const canvas = document.createElement('canvas');
              const video = videoRef.current;
              if (!video) return;
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Mirror fix for snapshot too
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imgData = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `${jewelryType}_tryon.png`;
                link.href = imgData;
                link.click();
              }
            }}
            className="absolute bottom-4 right-4 px-4 py-2 bg-emerald-600 rounded-lg text-black font-semibold hover:bg-emerald-500 transition-all"
          >
            Capture
          </button>
        </div>
      )}
    </div>
  );
}
