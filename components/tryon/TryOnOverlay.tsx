'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, RotateCw, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';

interface TryOnOverlayProps {
  jewelryType: 'ring' | 'necklace' | 'bracelet' | 'earring' | 'pendant';
}

export default function TryOnOverlay({ jewelryType }: TryOnOverlayProps) {
  const [mode, setMode] = useState<'upload' | 'camera' | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Log state changes
  useEffect(() => {
    console.log('State updated - Mode:', mode, 'Has image:', !!image, 'Processing:', isProcessing);
  }, [mode, image, isProcessing]);

  useEffect(() => {
    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Camera not supported in this browser');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        await videoRef.current.play();
        setMode('camera');
        toast.success('Camera started successfully!');
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        toast.error('No camera found. Please connect a camera.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        toast.error('Camera is already in use by another application.');
      } else {
        toast.error('Unable to access camera. Please check your browser settings.');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setMode(null);
  };

  const capturePhoto = () => {
    console.log('🎯 Capture photo clicked');
    
    if (!videoRef.current || !canvasRef.current) {
      console.error('❌ Video or canvas ref not available');
      toast.error('Camera not ready');
      return;
    }
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    console.log('📹 Video dimensions:', video.videoWidth, 'x', video.videoHeight);
    
    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('❌ Video not ready');
      toast.error('Camera not ready. Please wait a moment and try again.');
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      console.log('🎨 Drawing to canvas...');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      console.log('📸 Image captured, data length:', imageData.length);
      
      // Stop the camera after capture
      stopCamera();
      
      console.log('💾 Setting image state...');
      setImage(imageData);
      console.log('✅ Image state set');
      
      processImage(imageData);
    } else {
      console.error('❌ Could not get canvas context');
      toast.error('Failed to capture photo');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        console.log('Image data loaded, length:', imageData.length);
        setImage(imageData);
        setMode('upload');
        processImage(imageData);
        toast.success('Image uploaded successfully!');
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
        console.error('FileReader error');
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    // Simulate AR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    toast.success('Try-on ready!');
  };

  const downloadImage = () => {
    if (image) {
      const link = document.createElement('a');
      link.download = 'jewelry-tryon.png';
      link.href = image;
      link.click();
      toast.success('Image downloaded!');
    }
  };

  const reset = () => {
    stopCamera();
    setImage(null);
    setMode(null);
    setIsProcessing(false);
  };

  return (
    <div className="relative w-full aspect-video min-h-[500px] bg-white backdrop-blur-xl rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl">
      {/* Canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Stream */}
      {mode === 'camera' && !image && (
        <div className="relative w-full h-full min-h-[500px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onLoadedMetadata={() => console.log('Video stream ready')}
          />
          {/* Camera viewfinder guide */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-emerald-400/50 rounded-full"></div>
            </div>
          <div className="absolute top-4 left-4 right-4 text-center">
              <p className="text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg inline-block">
                Position yourself in the frame
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded/Captured Image */}
      {image && (
        <div className="relative w-full h-full min-h-[500px] bg-white">
          <div className="absolute top-2 left-2 bg-emerald-500 text-black px-2 py-1 rounded text-xs z-50">
            Image Active ✓
          </div>
          <img
            src={image}
            alt="Try-on"
            className="absolute inset-0 w-full h-full object-contain"
            onLoad={() => {
              console.log('✅ Image loaded successfully');
              console.log('Image src length:', image?.length);
            }}
            onError={(e) => {
              console.error('❌ Image failed to load', e);
              toast.error('Failed to load image');
            }}
          />
          
          {/* AR Overlay - Simulated jewelry overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {jewelryType === 'ring' && (
              <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2">
                <div className="w-32 h-32 rounded-full border-8 border-emerald-400 shadow-2xl shadow-emerald-500/50 animate-pulse" />
              </div>
            )}
            {jewelryType === 'necklace' && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
                <div className="w-64 h-2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full shadow-2xl shadow-emerald-500/50" />
              </div>
            )}
            {jewelryType === 'earring' && (
              <>
                <div className="absolute top-1/4 left-1/3">
                  <div className="w-12 h-16 bg-emerald-400 rounded-full shadow-2xl shadow-emerald-500/50" />
                </div>
                <div className="absolute top-1/4 right-1/3">
                  <div className="w-12 h-16 bg-emerald-400 rounded-full shadow-2xl shadow-emerald-500/50" />
                </div>
              </>
            )}
          </motion.div>

          {/* Processing Overlay */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full mx-auto mb-4"
                />
                <p className="text-white text-lg font-semibold">
                  Processing AR overlay...
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Debug Info */}
      <div className="absolute top-2 right-2 bg-black/80 text-emerald-400 px-3 py-2 rounded text-xs z-50 backdrop-blur-sm">
        Mode: {mode || 'none'} | Image: {image ? 'yes' : 'no'} | Processing: {isProcessing ? 'yes' : 'no'}
      </div>

      {/* Initial State - No Image/Camera */}
      {!mode && !image && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div 
              className="text-6xl mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              📸
            </motion.div>
            <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
              Virtual Try-On
            </h3>
            <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
              Upload a photo or use your camera to see how the jewelry looks on you
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={startCamera}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-xl font-bold flex items-center gap-3 justify-center shadow-lg"
              >
                <Camera className="w-5 h-5" />
                Use Camera
              </motion.button>
              
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.05, borderColor: '#10b981' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 backdrop-blur-xl border-2 border-emerald-500/30 text-gray-900 rounded-xl font-semibold flex items-center gap-3 justify-center hover:bg-emerald-50 transition-all"
                style={{ background: 'var(--glass-bg)' }}
              >
                <Upload className="w-5 h-5" />
                Upload Photo
              </motion.button>
            </div>
            
            {/* Debug: Test image button */}
            <button
              onClick={() => {
                console.log('🧪 Loading test image...');
                const testImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPnRlc3QgaW1hZ2U8L3RleHQ+PC9zdmc+';
                setImage(testImage);
                setMode('upload');
                toast.info('Test image loaded');
              }}
              className="mt-4 text-xs text-emerald-400 underline hover:text-emerald-300"
            >
              🧪 Load Test Image (Debug)
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </motion.div>
        </div>
      )}

      {/* Controls */}
      <AnimatePresence>
        {(mode || image) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-4"
          >
            {mode === 'camera' && !image && (
              <>
                <motion.button
                  onClick={capturePhoto}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-full font-bold flex items-center gap-3 shadow-xl"
                >
                  <Camera className="w-6 h-6" />
                  Capture Photo
                </motion.button>
                <motion.button
                  onClick={stopCamera}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-4 backdrop-blur-xl border border-emerald-500/30 text-gray-900 rounded-full font-semibold flex items-center gap-2"
                  style={{ background: 'var(--glass-bg)' }}
                >
                  <X className="w-5 h-5" />
                  Cancel
                </motion.button>
              </>
            )}

            {image && (
              <>
                <motion.button
                  onClick={downloadImage}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black rounded-xl font-bold flex items-center gap-3 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download
                </motion.button>
                <motion.button
                  onClick={reset}
                  whileHover={{ scale: 1.05, borderColor: '#10b981' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-4 backdrop-blur-xl border border-emerald-500/30 text-gray-900 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-50 transition-all"
                  style={{ background: 'var(--glass-bg)' }}
                >
                  <RotateCw className="w-5 h-5" />
                  Try Again
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

