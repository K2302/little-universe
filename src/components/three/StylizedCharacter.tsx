import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StylizedCharacterProps {
  position: [number, number, number];
  cloakColor?: string;
  scarfColor?: string;
  hasLantern?: boolean;
  rotationY?: number;
}

export const StylizedCharacter: React.FC<StylizedCharacterProps> = ({
  position,
  cloakColor = '#f4b8c8',
  scarfColor = '#ffd280',
  hasLantern = true,
  rotationY = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2.2) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* Cloak Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <coneGeometry args={[0.24, 0.65, 16]} />
        <meshStandardMaterial color={cloakColor} roughness={0.6} />
      </mesh>
      {/* Scarf Ring */}
      <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.035, 10, 20]} />
        <meshStandardMaterial color={scarfColor} emissive={scarfColor} emissiveIntensity={0.3} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color="#fff5eb" roughness={0.4} />
      </mesh>
      {/* Optional Warm Lantern */}
      {hasLantern && (
        <group position={[0.22, 0.45, 0.12]}>
          <mesh>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color="#ffd280" />
          </mesh>
          <pointLight color="#ffd280" intensity={0.8} distance={3} />
        </group>
      )}
    </group>
  );
};
