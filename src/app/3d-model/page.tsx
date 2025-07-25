'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

function ProductModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#4f46e5" 
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <ProductModel />
      
      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        MANDLACX 3D Product
      </Text>
      
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={1} 
        far={4} 
      />
      
      <Environment preset="city" />
    </>
  );
}

export default function ThreeDModelPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#151515] to-black">
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-white text-2xl font-bold font-plus-jakarta">
          MANDLACX 3D Product Showcase
        </h1>
        <p className="text-gray-300 mt-2">
          Interactive 3D model with animations and lighting
        </p>
      </div>
      
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 text-white text-sm">
        <p>Use mouse to rotate, zoom, and pan the 3D model</p>
      </div>
    </div>
  );
}