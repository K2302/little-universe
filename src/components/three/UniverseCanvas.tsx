import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useUniverseStore } from '../../store/useUniverseStore';
import { StylizedCharacter } from './StylizedCharacter';

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

  return (
    <Canvas
      shadows
      camera={{ position: [0, 3.2, 8.5], fov: 48 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[currentScene >= 6 ? '#1d1536' : '#070918']} />
      <fog attach="fog" args={[currentScene >= 6 ? '#2a1b3d' : '#070918', 8, 28]} />
      <ambientLight intensity={currentScene >= 6 ? 0.85 : 0.45} />
      <directionalLight position={[5, 10, 5]} intensity={1.1} color="#ffd280" castShadow />
      <Stars radius={40} depth={30} count={2500} factor={3.5} saturation={0.5} fade speed={1} />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.05} minDistance={4} maxDistance={16} />

      {/* Scene 1: Distant Glowing Planet */}
      {currentScene === 1 && (
        <group position={[0, 0.8, -3]}>
          <mesh>
            <sphereGeometry args={[1.35, 32, 32]} />
            <meshStandardMaterial color="#b8a9e0" emissive="#5e4b8b" emissiveIntensity={0.45} roughness={0.5} />
          </mesh>
          <mesh rotation={[1.1, 0.3, 0]}>
            <torusGeometry args={[2.2, 0.06, 16, 64]} />
            <meshBasicMaterial color="#f4b8c8" />
          </mesh>
        </group>
      )}

      {/* Scene 2 & Scene 7: Two Floating Islands & Star Bridge */}
      {(currentScene === 2 || currentScene === 7) && (
        <group>
          {/* Left Island (Me) */}
          <group position={[-4.8, -0.5, 0]}>
            <mesh receiveShadow>
              <cylinderGeometry args={[1.8, 1.1, 0.9, 24]} />
              <meshStandardMaterial color="#2b2d5c" />
            </mesh>
            <StylizedCharacter
              position={[0.4, 0.45, 0]}
              cloakColor="#7ee8fa"
              rotationY={Math.PI / 2}
            />
          </group>
          {/* Right Island (Her) */}
          <group position={[4.8, -0.5, 0]}>
            <mesh receiveShadow>
              <cylinderGeometry args={[1.8, 1.1, 0.9, 24]} />
              <meshStandardMaterial color="#3c2b5c" />
            </mesh>
            <StylizedCharacter
              position={[-0.4, 0.45, 0]}
              cloakColor="#f4b8c8"
              rotationY={-Math.PI / 2}
            />
            {currentScene === 7 && (
              <mesh position={[0, 0.65, 0.4]} onClick={() => openGift()}>
                <boxGeometry args={[0.45, 0.45, 0.45]} />
                <meshStandardMaterial
                  color={giftOpened ? '#ffd280' : '#f4b8c8'}
                  emissive="#ffd280"
                  emissiveIntensity={0.6}
                />
              </mesh>
            )}
          </group>
          {/* Star Bridge */}
          {config.scene2.stars.map((star) => {
            const active = visitedStars.includes(star.id) || currentScene === 7;
            return (
              <mesh
                key={star.id}
                position={star.position}
                onClick={(e) => {
                  e.stopPropagation();
                  markStarVisited(star.id);
                  if (currentScene === 2) {
                    openModal({ title: star.title, body: star.content });
                  }
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = 'auto';
                }}
              >
                <octahedronGeometry args={[0.26, 0]} />
                <meshStandardMaterial
                  color={active ? '#ffd280' : '#b8a9e0'}
                  emissive={active ? '#ffd280' : '#6c5ce7'}
                  emissiveIntensity={active ? 1.1 : 0.4}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Scene 3: Memory Garden */}
      {currentScene === 3 && (
        <group>
          <mesh position={[0, -0.5, 0]} receiveShadow>
            <cylinderGeometry args={[5.5, 4.8, 0.5, 32]} />
            <meshStandardMaterial color="#1f2447" />
          </mesh>
          {config.scene3.items.map((item) => {
            const found = discoveredGardenItems.includes(item.id);
            return (
              <mesh
                key={item.id}
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
                onPointerOut={() => {
                  document.body.style.cursor = 'auto';
                }}
              >
                <octahedronGeometry args={[0.38, 0]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={found ? 1.35 : 0.7}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Scene 4: Collect the Little Things Mini-Game */}
      {currentScene === 4 && (
        <group>
          <mesh position={[0, -0.4, 0]} receiveShadow>
            <cylinderGeometry args={[6.2, 5.5, 0.4, 32]} />
            <meshStandardMaterial color="#231f42" />
          </mesh>
          <StylizedCharacter position={[0, -0.2, 0]} />
          {config.scene4.collectibles.map((c) => {
            if (collectedGameItems.includes(c.id)) return null;
            return (
              <mesh
                key={c.id}
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
                onPointerOut={() => {
                  document.body.style.cursor = 'auto';
                }}
              >
                <octahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.9} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Scene 5: Room of Unsent Letters */}
      {currentScene === 5 && (
        <group>
          <mesh position={[0, -0.5, 0]} receiveShadow>
            <boxGeometry args={[6.5, 0.3, 5.5]} />
            <meshStandardMaterial color="#2a2244" />
          </mesh>
          {config.scene5.letters.map((l) => (
            <mesh
              key={l.id}
              position={l.position}
              onClick={() => markLetterRead(l.id)}
            >
              <boxGeometry args={[0.45, 0.32, 0.04]} />
              <meshStandardMaterial
                color={readLetters.includes(l.id) ? '#ffd280' : '#fff5eb'}
                emissive="#f6b96e"
                emissiveIntensity={0.35}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Scene 6: Our Future Little World */}
      {currentScene === 6 && (
        <group>
          {config.scene6.doorways.map((d) => (
            <mesh
              key={d.id}
              position={d.position}
              onClick={() => markDoorVisited(d.id)}
            >
              <boxGeometry args={[0.85, 1.6, 0.15]} />
              <meshStandardMaterial
                color={d.color}
                emissive={d.color}
                emissiveIntensity={visitedDoors.includes(d.id) ? 1.0 : 0.45}
              />
            </mesh>
          ))}
        </group>
      )}
    </Canvas>
  );
};
