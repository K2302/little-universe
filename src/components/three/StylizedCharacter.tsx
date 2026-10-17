import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StylizedCharacterProps {
  position: [number, number, number];
  cloakColor?: string;
  scarfColor?: string;
  hasLantern?: boolean;
  rotationY?: number;
  wave?: boolean;
}

export const StylizedCharacter: React.FC<StylizedCharacterProps> = ({
  position,
  cloakColor = '#f4b8c8',
  scarfColor = '#ffd280',
  hasLantern = true,
  rotationY = 0,
  wave = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 2.1) * 0.035;
      groupRef.current.scale.y = 1 + Math.sin(t * 2.1) * 0.025;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.45) * 0.28;
      headRef.current.rotation.x = Math.sin(t * 0.3) * 0.06;
    }
    if (armRef.current && wave) {
      const cycle = t % 9;
      const lift = cycle > 7 ? Math.sin((cycle - 7) * Math.PI) * 1.1 : 0;
      armRef.current.rotation.z = 0.35 + lift;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <coneGeometry args={[0.24, 0.65, 16]} />
        <meshStandardMaterial color={cloakColor} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.035, 10, 20]} />
        <meshStandardMaterial color={scarfColor} emissive={scarfColor} emissiveIntensity={0.3} />
      </mesh>
      <group ref={headRef} position={[0, 0.78, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial color="#fff5eb" roughness={0.4} />
        </mesh>
      </group>
      <group ref={armRef} position={[0.2, 0.5, 0]}>
        <mesh position={[0.02, 0.02, 0]} rotation={[0, 0, 0.4]}>
          <capsuleGeometry args={[0.035, 0.16, 4, 8]} />
          <meshStandardMaterial color={cloakColor} />
        </mesh>
      </group>
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
