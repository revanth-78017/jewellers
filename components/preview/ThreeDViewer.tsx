'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import Loader from '@/components/ui/Loader';

// Ring 3D Model Component
function Ring({ color = '#FFD700', gemstoneColor = '#B9F2FF' }: { color?: string; gemstoneColor?: string }) {
  const ringRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={ringRef}>
      {/* Ring Band */}
      <mesh
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        <torusGeometry args={[1, 0.15, 16, 50]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Gemstone */}
      <mesh position={[0, 0.5, 0]} scale={hovered ? 1.1 : 1}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshPhysicalMaterial
          color={gemstoneColor}
          metalness={0}
          roughness={0}
          transmission={0.9}
          thickness={0.5}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      {/* Prongs */}
      {[0, 90, 180, 270].map((angle, i) => {
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * 0.15;
        const z = Math.sin(radian) * 0.15;
        return (
          <mesh key={i} position={[x, 0.3, z]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Necklace 3D Model Component
function Necklace({ color = '#FFD700' }: { color?: string }) {
  const necklaceRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (necklaceRef.current) {
      necklaceRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={necklaceRef}>
      {/* Chain */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const x = Math.cos(angle) * 1.5;
        const y = Math.sin(angle) * 0.5 - 0.5;
        const z = Math.sin(angle) * 1.5;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        );
      })}

      {/* Pendant */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  );
}

interface ThreeDViewerProps {
  type?: 'ring' | 'necklace' | 'bracelet' | 'earring' | 'pendant';
  color?: string;
  gemstoneColor?: string;
}

export default function ThreeDViewer({ 
  type = 'ring', 
  color = '#FFD700',
  gemstoneColor = '#B9F2FF'
}: ThreeDViewerProps) {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* 3D Models */}
        <Suspense fallback={null}>
          {type === 'ring' && <Ring color={color} gemstoneColor={gemstoneColor} />}
          {type === 'necklace' && <Necklace color={color} />}
          {type === 'bracelet' && <Ring color={color} gemstoneColor={gemstoneColor} />}
          {type === 'earring' && <Ring color={color} gemstoneColor={gemstoneColor} />}
          {type === 'pendant' && <Necklace color={color} />}
        </Suspense>
        
        {/* Contact Shadows */}
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        
        {/* Controls */}
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="glass rounded-xl px-4 py-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Drag to rotate • Scroll to zoom
          </p>
        </div>
        
        <motion.button
          onClick={() => setAutoRotate(!autoRotate)}
          className="glass rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-black/50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {autoRotate ? '⏸ Pause' : '▶ Play'}
        </motion.button>
      </div>

      {/* Loading Fallback */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader size="lg" text="Loading 3D model..." />
        </div>
      } />
    </div>
  );
}

