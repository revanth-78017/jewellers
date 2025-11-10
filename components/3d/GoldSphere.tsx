'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function RotatingGoldSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main Gold Sphere */}
        <mesh ref={meshRef} castShadow>
          <icosahedronGeometry args={[1, 8]} />
          <meshStandardMaterial
            color="#10b981"
            metalness={0.95}
            roughness={0.15}
            emissive="#059669"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Glow Effect - Inner Sphere */}
        <mesh>
          <icosahedronGeometry args={[1.05, 4]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={256}
            transmission={0.95}
            roughness={0.1}
            thickness={0.5}
            ior={1.5}
            chromaticAberration={0.5}
            anisotropy={1}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#10b981"
          />
        </mesh>

        {/* Outer Glow Ring */}
        <mesh scale={[1.2, 1.2, 1.2]}>
          <torusGeometry args={[0.8, 0.05, 16, 100]} />
          <meshBasicMaterial
            color="#34d399"
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Particles around sphere - precomputed to avoid randomness in render */}
        {useMemo(() => {
          return Array.from({ length: 50 }).map((_, i) => {
            const radius = 1.5 + Math.random() * 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color="#34d399" transparent opacity={0.6} />
              </mesh>
            );
          });
        }, [])}
      </group>
    </Float>
  );
}

export default function GoldSphere() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
          color="#10b981"
        />
        <spotLight
          position={[-10, -10, -10]}
          angle={0.15}
          penumbra={1}
          intensity={0.5}
          color="#059669"
        />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#34d399" />

        {/* Main Sphere */}
        <RotatingGoldSphere />

        {/* Environment for reflections */}
        <Environment preset="sunset" />

        {/* Optional: Enable orbit controls for debugging */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
}

