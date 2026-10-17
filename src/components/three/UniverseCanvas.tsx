import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PerspectiveCamera, Group, Mesh } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls, Stars } from '@react-three/drei';
import { useUniverseStore } from '../../store/useUniverseStore';
import { StylizedCharacter } from './StylizedCharacter';

function useIsCompact() {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );
  useEffect(() => {
    const q = window.matchMedia('(max-width: 767px)');
    const onChange = () => setCompact(q.matches);
    q.addEventListener('change', onChange);
    return () => q.removeEventListener('change', onChange);
  }, []);
  return compact;
}

function AdaptiveCamera({ compact }: { compact: boolean }) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.fov = compact ? 58 : 48;
    camera.position.set(0, compact ? 4.1 : 3.2, compact ? 11.5 : 8.5);
    camera.updateProjectionMatrix();
  }, [camera, compact]);
  return null;
}

function FloatingDust({ compact }: { compact: boolean }) {
  const group = useRef<Group>(null);
  const count = compact ? 44 : 90;
  const particles = React.useMemo(() => Array.from({ length: count }, (_, i) => ({
    position: [
      Math.sin(i * 12.9898) * 9,
      Math.cos(i * 4.141) * 4.5,
      -2 - ((i * 7) % 18),
    ] as [number, number, number],
    scale: 0.025 + (i % 5) * 0.009,
    speed: 0.25 + (i % 7) * 0.06,
  })), [count]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.045) * 0.08;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.15) * 0.12;
  });

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#ffd9a0' : i % 3 === 1 ? '#f5a8d1' : '#a9b7ff'}
            transparent
            opacity={0.45 + (i % 4) * 0.12}
          />
        </mesh>
      ))}
    </group>
  );
}

function AnimatedPlanet() {
  const planet = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (planet.current) {
      planet.current.rotation.y = clock.elapsedTime * 0.06;
      planet.current.position.y = 0.8 + Math.sin(clock.elapsedTime * 0.45) * 0.12;
    }
    if (ring.current) ring.current.rotation.z = 0.12 + Math.sin(clock.elapsedTime * 0.2) * 0.06;
  });
  return (
    <group position={[0, 0.8, -3]}>
      <mesh ref={planet}>
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshStandardMaterial
          color="#b8a9e0"
          emissive="#5e4b8b"
          emissiveIntensity={0.65}
          roughness={0.48}
          metalness={0.12}
        />
      </mesh>
      <mesh ref={ring} rotation={[1.1, 0.3, 0]}>
        <torusGeometry args={[2.2, 0.045, 12, 80]} />
        <meshBasicMaterial color="#f4b8c8" transparent opacity={0.88} />
      </mesh>
      <mesh rotation={[1.1, 0.3, 0]}>
        <torusGeometry args={[2.32, 0.012, 8, 80]} />
        <meshBasicMaterial color="#ffd280" transparent opacity={0.65} />
      </mesh>
      <pointLight color="#bda8ff" intensity={18} distance={8} />
    </group>
  );
}

function FloatingIsland({ position, tint }: {
  position: [number, number, number];
  tint: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 1.1, 0.9, 7, 1]} />
        <meshStandardMaterial color={tint} roughness={0.92} flatShading />
      </mesh>
      <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.78, 1.65, 0.18, 9]} />
        <meshStandardMaterial color="#425b69" roughness={1} flatShading />
      </mesh>
      {[
        [-0.9, 0.52, 0.45, 0.36],
        [-0.25, 0.52, -0.72, 0.25],
        [0.75, 0.52, 0.3, 0.31],
        [0.45, 0.52, -0.5, 0.2],
        [-0.65, 0.52, -0.28, 0.19],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={s} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 2 ? '#6d9a88' : '#82aa91'}
            roughness={1}
            flatShading
          />
        </mesh>
      ))}
      <Float speed={1.2} rotationIntensity={0.16} floatIntensity={0.1}>
        <mesh position={[0.4, 1.05, 0.15]} castShadow>
          <icosahedronGeometry args={[0.18, 1]} />
          <meshStandardMaterial color="#ffd280" emissive="#f6b96e" emissiveIntensity={1.6} />
        </mesh>
      </Float>
      <pointLight position={[0, 1.2, 0]} color="#f4b8c8" intensity={2.4} distance={4} />
    </group>
  );
}

function PetalGarden({ compact }: { compact: boolean }) {
  const count = compact ? 26 : 48;
  const petals = React.useMemo(() => Array.from({ length: count }, (_, i) => ({
    position: [
      Math.sin(i * 4.5) * (1.3 + (i % 5) * 0.7),
      -0.06 + (i % 4) * 0.1,
      Math.cos(i * 3.2) * (1.3 + (i % 6) * 0.55),
    ] as [number, number, number],
    hue: i % 3,
  })), [count]);
  return (
    <group>
      {petals.map((p, i) => (
        <Float key={i} speed={0.6 + (i % 4) * 0.17} rotationIntensity={0.9} floatIntensity={0.16}>
          <mesh position={p.position} rotation={[0.4 + i * 0.15, i * 0.7, 0.6]}>
            <sphereGeometry args={[0.11, 8, 8]} />
            <meshBasicMaterial
              color={p.hue === 0 ? '#f4b8c8' : p.hue === 1 ? '#ffd280' : '#c5b5ff'}
              transparent
              opacity={0.78}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export const UniverseCanvas: React.FC = () => {
  const {
    currentScene,
    config,
    visitedStars,
    markStarVisited,
    discoveredGardenItems,
    markGardenItem,
    collectedGameItems,
    collectGameItem,
    readLetters,
    markLetterRead,
    visitedDoors,
    markDoorVisited,
    giftOpened,
    openGift,
    openModal,
  } = useUniverseStore();

  const compact = useIsCompact();

  return (
    <Canvas
      shadows={!compact}
      dpr={compact ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, compact ? 4.1 : 3.2, compact ? 11.5 : 8.5], fov: compact ? 58 : 48 }}
      gl={{ antialias: !compact, powerPreference: compact ? 'low-power' : 'high-performance' }}
    >
      <AdaptiveCamera compact={compact} />
      <color attach="background" args={[currentScene >= 6 ? '#1d1536' : '#070918']} />
      <fog attach="fog" args={[currentScene >= 6 ? '#2a1b3d' : '#070918', 8, 28]} />
      <ambientLight intensity={currentScene >= 6 ? 0.72 : 0.38} />
      <hemisphereLight args={['#b7baff', '#30203f', 0.55]} />
      <directionalLight position={[5, 10, 5]} intensity={1.25} color="#ffd9ad" castShadow={!compact} />
      <pointLight position={[-5, 2, -4]} color="#8e7bff" intensity={compact ? 5 : 9} distance={20} />
      <pointLight position={[5, 1, 1]} color="#ff85bd" intensity={compact ? 3 : 5} distance={15} />
      <Stars
        radius={40}
        depth={30}
        count={compact ? 900 : 2500}
        factor={compact ? 2.6 : 3.5}
        saturation={0.5}
        fade
        speed={1}
      />
      <FloatingDust compact={compact} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        maxPolarAngle={Math.PI / 2.05}
        minDistance={compact ? 5.5 : 4}
        maxDistance={compact ? 18 : 16}
        rotateSpeed={compact ? 0.65 : 1}
      />

      {/* Scene 1: A breathing planet and two layers of orbital rings. */}
      {currentScene === 1 && <AnimatedPlanet />}

      {/* Scene 2 & 7: Terraced islands with a soft atmospheric glow. */}
      {(currentScene === 2 || currentScene === 7) && (
        <group>
          <FloatingIsland position={[-4.8, -0.5, 0]} tint="#2b2d5c" />
          <StylizedCharacter
            position={[-4.4, -0.05, 0]}
            cloakColor="#7ee8fa"
            rotationY={Math.PI / 2}
          />
          <FloatingIsland position={[4.8, -0.5, 0]} tint="#3c2b5c" />
          <StylizedCharacter
            position={[4.4, -0.05, 0]}
            cloakColor="#f4b8c8"
            rotationY={-Math.PI / 2}
          />
          {currentScene === 7 && (
            <Float speed={2} rotationIntensity={0.8} floatIntensity={0.25}>
              <mesh position={[4.8, 0.55, 0.4]} onClick={() => openGift()}>
                <boxGeometry args={[0.45, 0.45, 0.45]} />
                <meshStandardMaterial
                  color={giftOpened ? '#ffd280' : '#f4b8c8'}
                  emissive="#ffd280"
                  emissiveIntensity={0.85}
                  metalness={0.25}
                  roughness={0.3}
                />
              </mesh>
            </Float>
          )}
          {config.scene2.stars.map((star) => {
            const active = visitedStars.includes(star.id) || currentScene === 7;
            return (
              <Float key={star.id} speed={1.4} rotationIntensity={0.4} floatIntensity={0.2}>
                <mesh
                  position={star.position}
                  onClick={(e) => {
                    e.stopPropagation();
                    markStarVisited(star.id);
                    if (currentScene === 2) openModal({ title: star.title, body: star.content });
                  }}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                  }}
                  onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                >
                  <octahedronGeometry args={[0.26, 1]} />
                  <meshStandardMaterial
                    color={active ? '#ffd280' : '#b8a9e0'}
                    emissive={active ? '#ffd280' : '#6c5ce7'}
                    emissiveIntensity={active ? 1.45 : 0.65}
                    metalness={0.1}
                    roughness={0.25}
                  />
                </mesh>
              </Float>
            );
          })}
        </group>
      )}

      {/* Scene 3: Garden ground, floating petals, and discoverable light fragments. */}
      {currentScene === 3 && (
        <group>
          <mesh position={[0, -0.5, 0]} receiveShadow>
            <cylinderGeometry args={[5.5, 4.8, 0.5, 48]} />
            <meshStandardMaterial color="#1f2447" roughness={0.92} />
          </mesh>
          <PetalGarden compact={compact} />
          {config.scene3.items.map((item) => {
            const found = discoveredGardenItems.includes(item.id);
            return (
              <Float key={item.id} speed={found ? 1.8 : 0.95} rotationIntensity={0.75} floatIntensity={0.24}>
                <mesh
                  position={item.position}
                  onClick={(e) => {
                    e.stopPropagation();
                    markGardenItem(item.id);
                    openModal({ title: item.title, body: item.placeholderNote });
                  }}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                  }}
                  onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                >
                  <icosahedronGeometry args={[0.34, 1]} />
                  <meshStandardMaterial
                    color={item.color}
                    emissive={item.color}
                    emissiveIntensity={found ? 1.8 : 0.95}
                    roughness={0.28}
                    metalness={0.12}
                  />
                </mesh>
              </Float>
            );
          })}
        </group>
      )}

      {/* Scene 4: Keepsakes hover over a small moonlit arena. */}
      {currentScene === 4 && (
        <group>
          <mesh position={[0, -0.4, 0]} receiveShadow>
            <cylinderGeometry args={[6.2, 5.5, 0.4, 48]} />
            <meshStandardMaterial color="#231f42" roughness={0.95} />
          </mesh>
          <PetalGarden compact={compact} />
          <StylizedCharacter position={[0, -0.2, 0]} />
          {config.scene4.collectibles.map((c) => {
            if (collectedGameItems.includes(c.id)) return null;
            return (
              <Float key={c.id} speed={1.7} rotationIntensity={0.85} floatIntensity={0.28}>
                <mesh
                  position={c.position}
                  onClick={(e) => {
                    e.stopPropagation();
                    collectGameItem(c.id);
                    openModal({ title: c.name, body: c.message });
                  }}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                  }}
                  onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                >
                  <dodecahedronGeometry args={[0.3, 1]} />
                  <meshStandardMaterial
                    color={c.color}
                    emissive={c.color}
                    emissiveIntensity={1.2}
                    metalness={0.15}
                    roughness={0.28}
                  />
                </mesh>
              </Float>
            );
          })}
        </group>
      )}

      {/* Scene 5: Layered letter cards with warm point lights. */}
      {currentScene === 5 && (
        <group>
          <mesh position={[0, -0.5, 0]} receiveShadow>
            <boxGeometry args={[6.5, 0.3, 5.5]} />
            <meshStandardMaterial color="#2a2244" roughness={0.9} />
          </mesh>
          <pointLight position={[0, 2.5, 0]} color="#ffc78b" intensity={compact ? 4 : 7} distance={10} />
          {config.scene5.letters.map((l) => (
            <Float key={l.id} speed={0.7} rotationIntensity={0.13} floatIntensity={0.12}>
              <mesh
                position={l.position}
                onClick={() => markLetterRead(l.id)}
              >
                <boxGeometry args={[0.62, 0.42, 0.06]} />
                <meshStandardMaterial
                  color={readLetters.includes(l.id) ? '#ffd280' : '#fff5eb'}
                  emissive="#f6b96e"
                  emissiveIntensity={0.5}
                  roughness={0.7}
                />
              </mesh>
            </Float>
          ))}
        </group>
      )}

      {/* Scene 6: Future doorways become softly glowing portals. */}
      {currentScene === 6 && (
        <group>
          {config.scene6.doorways.map((d) => (
            <Float key={d.id} speed={0.6} rotationIntensity={0.05} floatIntensity={0.09}>
              <group position={d.position}>
                <mesh>
                  <boxGeometry args={[0.85, 1.6, 0.15]} />
                  <meshStandardMaterial
                    color={d.color}
                    emissive={d.color}
                    emissiveIntensity={visitedDoors.includes(d.id) ? 1.4 : 0.7}
                    roughness={0.24}
                    metalness={0.2}
                  />
                </mesh>
                <mesh position={[0, 0, 0.09]}>
                  <planeGeometry args={[0.65, 1.38]} />
                  <meshBasicMaterial color="#120e2d" transparent opacity={0.72} />
                </mesh>
                <pointLight color={d.color} intensity={1.6} distance={2.8} />
              </group>
            </Float>
          ))}
        </group>
      )}
    </Canvas>
  );
};
