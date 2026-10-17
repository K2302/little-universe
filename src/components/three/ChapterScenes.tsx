import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { letterBody } from '../../config/experienceData';
import { useUniverseStore } from '../../store/useUniverseStore';
import { StylizedCharacter } from './StylizedCharacter';
import {
  Fireflies,
  Flower,
  Glow,
  GrassTufts,
  Hotspot,
  Mushroom,
  NebulaClouds,
  ParallaxClouds,
  Rock,
  SparkleField,
  StarBurst,
  StylizedTree,
  makePlanetTexture,
} from './sharedWorld';

type Vec3 = [number, number, number];

function bezierPoint(t: number, a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const u = 1 - t;
  return [
    u * u * a[0] + 2 * u * t * b[0] + t * t * c[0],
    u * u * a[1] + 2 * u * t * b[1] + t * t * c[1],
    u * u * a[2] + 2 * u * t * b[2] + t * t * c[2],
  ];
}

function Island({
  position,
  grass,
  rock,
  light,
  landmark = 'lantern',
}: {
  position: Vec3;
  grass: string;
  rock: string;
  light: string;
  landmark?: 'lantern' | 'stone';
}) {
  return (
    <group position={position}>
      <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 0.35, 1.5, 7]} />
        <meshStandardMaterial color={rock} roughness={1} flatShading />
      </mesh>
      <mesh position={[0, -1.35, 0]} rotation={[0, 0.3, 0]} castShadow>
        <coneGeometry args={[0.55, 1.1, 6]} />
        <meshStandardMaterial color="#2a2438" roughness={1} flatShading />
      </mesh>
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <cylinderGeometry args={[1.72, 1.55, 0.22, 10]} />
        <meshStandardMaterial color={grass} roughness={1} />
      </mesh>
      <mesh position={[0, 0.34, 0]} receiveShadow>
        <cylinderGeometry args={[1.55, 1.5, 0.08, 10]} />
        <meshStandardMaterial color="#5d8a6e" roughness={1} />
      </mesh>
      <GrassTufts count={28} radius={1.35} color="#6fa57c" />
      <StylizedTree position={[-0.7, 0.3, 0.35]} scale={0.85} leaf="#3f7a58" />
      <StylizedTree position={[0.55, 0.3, -0.45]} scale={0.65} leaf="#4c8a62" />
      <Flower position={[-0.35, 0.34, 0.7]} color="#f4b8c8" sway={0.2} />
      <Flower position={[0.8, 0.34, 0.3]} color="#ffd280" sway={1.1} />
      <Flower position={[0.15, 0.34, -0.85]} color="#c5b5ff" sway={2.2} />
      <Rock position={[-0.95, 0.38, -0.2]} scale={0.7} />
      {landmark === 'lantern' ? (
        <group position={[0.35, 0.55, 0.55]}>
          <mesh>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color={light} />
          </mesh>
          <Glow color={light} scale={0.28} opacity={0.22} />
          <pointLight color={light} intensity={1.8} distance={3.4} />
        </group>
      ) : (
        <mesh position={[0.5, 0.55, 0.4]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.12, 0.38, 0.08]} />
          <meshStandardMaterial color="#d7c4a3" roughness={0.8} />
        </mesh>
      )}
      <pointLight position={[0, 1.4, 0]} color={light} intensity={2.2} distance={4.5} />
    </group>
  );
}

export function Chapter1({ compact }: { compact: boolean }) {
  const planet = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Group>(null);
  const tex = useMemo(() => makePlanetTexture(), []);
  const [bursts, setBursts] = useState<{ id: number; pos: Vec3 }[]>([]);
  const { openModal, config } = useUniverseStore();

  const storyStars = useMemo(
    () => [
      {
        id: 'intro-1',
        position: [-2.6, 1.8, 1.2] as Vec3,
        title: config.ui.sceneTitles[1],
        body: config.scene1.openingLine1,
      },
      {
        id: 'intro-2',
        position: [2.8, 2.1, 0.4] as Vec3,
        title: { en: 'for you', vi: 'cho em' },
        body: config.scene1.openingLine2,
      },
      {
        id: 'intro-3',
        position: [0.4, 3.1, -1.1] as Vec3,
        title: { en: 'a little universe', vi: 'một vũ trụ nhỏ' },
        body: {
          en: 'tap the planet. drag the empty sky.\nthis chapter is just the door, babe ✨',
          vi: 'chạm hành tinh. kéo trời trống.\nchương này chỉ là cánh cửa thôi babe ✨',
        },
      },
    ],
    [config]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (planet.current) {
      planet.current.rotation.y = t * 0.05;
      planet.current.position.y = Math.sin(t * 0.4) * 0.08;
    }
    if (rings.current) rings.current.rotation.z = 0.08 + Math.sin(t * 0.18) * 0.05;
    if (moon.current) {
      moon.current.position.set(Math.cos(t * 0.22) * 3.4, 1.1 + Math.sin(t * 0.3) * 0.25, Math.sin(t * 0.22) * 2.2 - 2.2);
    }
  });

  return (
    <group>
      <NebulaClouds compact={compact} />
      <group position={[0, 0.55, -2.6]}>
        <mesh ref={planet} castShadow>
          <sphereGeometry args={[1.42, 64, 64]} />
          <meshStandardMaterial
            map={tex}
            roughness={0.55}
            metalness={0.08}
            emissive="#3a2458"
            emissiveIntensity={0.28}
          />
        </mesh>
        <mesh scale={1.14}>
          <sphereGeometry args={[1.42, 32, 32]} />
          <meshBasicMaterial color="#9bb7ff" transparent opacity={0.16} side={THREE.BackSide} />
        </mesh>
        <mesh scale={1.05}>
          <sphereGeometry args={[1.42, 32, 32]} />
          <meshBasicMaterial color="#ffc2d4" transparent opacity={0.08} />
        </mesh>
        <group ref={rings} rotation={[1.12, 0.28, 0]}>
          <mesh>
            <torusGeometry args={[2.28, 0.055, 12, 96]} />
            <meshStandardMaterial color="#f4b8c8" transparent opacity={0.55} roughness={0.3} emissive="#f4b8c8" emissiveIntensity={0.35} />
          </mesh>
          <mesh>
            <torusGeometry args={[2.55, 0.028, 10, 96]} />
            <meshStandardMaterial color="#ffd280" transparent opacity={0.42} roughness={0.25} emissive="#ffd280" emissiveIntensity={0.4} />
          </mesh>
        </group>
        <pointLight color="#c8b0ff" intensity={16} distance={9} />
        <SparkleField color="#ffd9c0" count={compact ? 12 : 28} scale={3.4} />
      </group>
      <group ref={moon}>
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#efe6d8" roughness={0.85} emissive="#bfb4a4" emissiveIntensity={0.15} />
        </mesh>
        <Glow color="#fff4e0" scale={0.5} opacity={0.18} />
      </group>
      {storyStars.map((s) => (
        <Float key={s.id} speed={1.4} floatIntensity={0.25} rotationIntensity={0.4}>
          <Hotspot
            onSelect={() => {
              setBursts((b) => [...b, { id: Date.now() + Math.random(), pos: s.position }]);
              openModal({ title: s.title, body: s.body });
            }}
          >
            <group position={s.position}>
              <mesh>
                <octahedronGeometry args={[0.16, 0]} />
                <meshStandardMaterial color="#ffe9b0" emissive="#ffe9b0" emissiveIntensity={1.6} />
              </mesh>
              <Glow color="#ffe9b0" scale={0.42} opacity={0.3} />
            </group>
          </Hotspot>
        </Float>
      ))}
      {bursts.map((b) => (
        <StarBurst key={b.id} position={b.pos} />
      ))}
    </group>
  );
}

export function Chapter2({ compact, finale }: { compact: boolean; finale?: boolean }) {
  const {
    config,
    visitedStars,
    markStarVisited,
    openModal,
    giftOpened,
    openGift,
  } = useUniverseStore();
  const pathCount = compact ? 14 : 22;
  const path = useMemo(
    () => Array.from({ length: pathCount }, (_, i) => bezierPoint(i / (pathCount - 1), [-4.4, 0.95, 0], [0, 2.55, 0.15], [4.4, 0.95, 0])),
    [pathCount]
  );
  const lit = finale ? pathCount : Math.min(pathCount, Math.round((visitedStars.length / Math.max(1, config.scene2.stars.length)) * pathCount));

  return (
    <group>
      {!compact && <ParallaxClouds compact={compact} />}
      <Island position={[-4.85, -0.35, 0]} grass="#3d6f78" rock="#24344a" light="#7ee8fa" landmark="stone" />
      <Island position={[4.85, -0.35, 0]} grass="#6a4e62" rock="#3a243c" light="#f4b8c8" landmark="lantern" />
      <pointLight position={[-4.85, 2.2, 1]} color="#7ee8fa" intensity={4.5} distance={7} />
      <pointLight position={[4.85, 2.2, 1]} color="#f4b8c8" intensity={4.5} distance={7} />
      <StylizedCharacter
        position={finale ? [-0.55, 0.28, 0.35] : [-4.45, 0.28, 0.2]}
        cloakColor="#7ee8fa"
        rotationY={finale ? 0.4 : Math.PI / 2}
        wave
      />
      <StylizedCharacter
        position={finale ? [0.55, 0.28, 0.35] : [4.45, 0.28, 0.2]}
        cloakColor="#f4b8c8"
        rotationY={finale ? -0.4 : -Math.PI / 2}
        wave
      />
      {path.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i < lit ? 0.07 : 0.045, 8, 8]} />
          <meshBasicMaterial
            color={i < lit ? '#ffe7a8' : '#8b82c4'}
            transparent
            opacity={i < lit ? 0.95 : 0.35}
          />
        </mesh>
      ))}
      {config.scene2.stars.map((star) => {
        const active = visitedStars.includes(star.id) || !!finale;
        return (
          <Float key={star.id} speed={1.3} rotationIntensity={0.35} floatIntensity={0.18}>
            <Hotspot
              onSelect={() => {
                markStarVisited(star.id);
                if (!finale) openModal({ title: star.title, body: star.content });
              }}
            >
              <mesh position={star.position}>
                <octahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial
                  color={active ? '#ffd280' : '#b8a9e0'}
                  emissive={active ? '#ffd280' : '#6c5ce7'}
                  emissiveIntensity={active ? 1.7 : 0.55}
                />
              </mesh>
              {active && (
                <group position={star.position}>
                  <Glow color="#ffd280" scale={0.45} opacity={0.22} />
                </group>
              )}
            </Hotspot>
          </Float>
        );
      })}
      {finale && (
        <>
          <mesh position={[0, -0.15, 0]} receiveShadow>
            <cylinderGeometry args={[3.3, 2.4, 0.55, 10]} />
            <meshStandardMaterial color="#3d5a4c" roughness={1} />
          </mesh>
          <mesh position={[0, 0.18, 0]} receiveShadow>
            <cylinderGeometry args={[3.15, 3.05, 0.16, 12]} />
            <meshStandardMaterial color="#547a62" roughness={1} />
          </mesh>
          <StylizedTree position={[-1.6, 0.2, -1.1]} scale={1.1} />
          <StylizedTree position={[1.7, 0.2, -0.8]} scale={0.9} leaf="#4a7a58" />
          <BirthdayGift position={[0, 1.15, 0.1]} opened={giftOpened} onOpen={openGift} />
          <mesh position={[-9.5, 1.6, -8]} scale={0.35}>
            <sphereGeometry args={[1.4, 16, 16]} />
            <meshStandardMaterial color="#b8a9e0" emissive="#5e4b8b" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[8.5, 0.4, -7]}>
            <boxGeometry args={[1.2, 0.9, 1.2]} />
            <meshStandardMaterial color="#c9b08a" />
          </mesh>
          <mesh position={[8.5, 1.05, -7]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.95, 0.7, 4]} />
            <meshStandardMaterial color="#8b3d4a" />
          </mesh>
        </>
      )}
    </group>
  );
}

function BirthdayGift({
  position,
  opened,
  onOpen,
}: {
  position: Vec3;
  opened: boolean;
  onOpen: () => void;
}) {
  const core = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (core.current) core.current.rotation.y = clock.elapsedTime * 0.35;
  });

  if (opened) {
    return (
      <group position={position}>
        <HeartConstellation />
        <SparkleField color="#ffd280" count={40} scale={2.6} />
        <pointLight color="#ffd280" intensity={8} distance={8} />
      </group>
    );
  }

  return (
    <Float speed={1.6} floatIntensity={0.28} rotationIntensity={0.15}>
      <Hotspot onSelect={onOpen}>
        <group position={position} ref={core}>
          <mesh castShadow>
            <boxGeometry args={[0.62, 0.5, 0.62]} />
            <meshStandardMaterial color="#c45c78" roughness={0.35} metalness={0.12} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.64, 0.1, 0.64]} />
            <meshStandardMaterial color="#ffd280" emissive="#ffd280" emissiveIntensity={0.4} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.52, 0.1, 0.1]} />
            <meshStandardMaterial color="#ffd280" emissive="#ffd280" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <torusGeometry args={[0.08, 0.025, 8, 16]} />
            <meshStandardMaterial color="#ffe7a8" emissive="#ffe7a8" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#fff4cc" transparent opacity={0.45} />
          </mesh>
          <Glow color="#ffd280" scale={0.85} opacity={0.18} />
          <SparkleField color="#ffc6d8" count={18} scale={1.4} />
        </group>
      </Hotspot>
    </Float>
  );
}

function HeartConstellation() {
  const pts = useMemo(() => {
    const list: Vec3[] = [];
    for (let i = 0; i < 28; i++) {
      const t = (i / 28) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      list.push([x * 0.028, y * 0.028 + 0.35, 0]);
    }
    return list;
  }, []);
  return (
    <group>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#ffe7b0" />
        </mesh>
      ))}
    </group>
  );
}

function GardenKeepsake({
  id,
  color,
  found,
}: {
  id: string;
  color: string;
  found: boolean;
}) {
  if (id === 'garden-2') {
    return (
      <group>
        <mesh rotation={[0, 0.4, 0.1]}>
          <capsuleGeometry args={[0.08, 0.42, 4, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={found ? 0.8 : 0.3} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.32, 6]} />
          <meshStandardMaterial color="#efe6d6" />
        </mesh>
      </group>
    );
  }
  if (id === 'garden-3') {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={found ? 1.4 : 0.7} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.12, 8]} />
          <meshStandardMaterial color="#d7c4a3" />
        </mesh>
        <Glow color={color} scale={0.4} opacity={0.25} />
      </group>
    );
  }
  if (id === 'garden-4') {
    return (
      <group>
        <mesh>
          <torusGeometry args={[0.14, 0.018, 8, 20]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} emissive={color} emissiveIntensity={0.4} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.sin(i) * 0.1, -0.16, Math.cos(i) * 0.1]}>
            <boxGeometry args={[0.04, 0.12, 0.02]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
    );
  }
  if (id === 'garden-5') {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={found ? 1.2 : 0.5} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.sin((i / 5) * Math.PI * 2) * 0.16, 0.02, Math.cos((i / 5) * Math.PI * 2) * 0.16]} scale={0.055}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#ffe7b0" emissive="#ffe7b0" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    );
  }
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[Math.sin((i / 5) * Math.PI * 2) * 0.1, 0.04, Math.cos((i / 5) * Math.PI * 2) * 0.1]}
          scale={0.07}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={found ? 1 : 0.45} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffe7b0" />
      </mesh>
    </group>
  );
}

export function Chapter3({ compact }: { compact: boolean }) {
  const { config, discoveredGardenItems, markGardenItem, openModal } = useUniverseStore();
  const complete = discoveredGardenItems.length >= config.scene3.items.length;
  const bloom = complete ? 1 : discoveredGardenItems.length / Math.max(1, config.scene3.items.length);

  return (
    <group>
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 4.3, 0.85, 24]} />
        <meshStandardMaterial color="#2a4034" roughness={1} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5, 36]} />
        <meshStandardMaterial color="#3f6a50" roughness={1} />
      </mesh>
      <mesh position={[-0.4, 0.18, -0.6]} scale={[2.8, 0.28, 2.2]}>
        <sphereGeometry args={[1, 18, 12]} />
        <meshStandardMaterial color="#4a7a58" roughness={1} />
      </mesh>
      <mesh position={[1.1, 0.06, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 24]} />
        <meshStandardMaterial color="#3d7ea8" roughness={0.2} metalness={0.2} emissive="#1c3d58" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.1, 0.07, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.92, 1.08, 24]} />
        <meshStandardMaterial color="#6d8b62" />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const t = i / 9;
        return (
          <mesh key={i} position={[-2.4 + t * 3.4, 0.08, -1.8 + Math.sin(t * 3) * 1.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.16, 8]} />
            <meshStandardMaterial color="#cbb48a" />
          </mesh>
        );
      })}
      <GrassTufts count={compact ? 40 : 70} radius={4.1} />
      <StylizedTree position={[-2.8, 0.05, -1.4]} scale={1.2} leaf="#3a6e4c" />
      <StylizedTree position={[2.6, 0.05, -1.8]} scale={1.05} leaf="#4a7d58" />
      <StylizedTree position={[-1.6, 0.05, 2.4]} scale={0.8} leaf="#2f5e44" />
      <Flower position={[-1.2, 0.05, 0.4]} color="#f4b8c8" sway={0.4} bloom={0.6 + bloom} />
      <Flower position={[0.4, 0.05, -1.6]} color="#ffd280" sway={1.3} bloom={0.6 + bloom} />
      <Flower position={[2.1, 0.05, 0.8]} color="#c5b5ff" sway={2.1} bloom={0.6 + bloom} />
      <Mushroom position={[-2.2, 0.05, 0.9]} color="#f4b8c8" />
      <Mushroom position={[-2.45, 0.05, 1.15]} color="#ffd280" />
      <Mushroom position={[2.3, 0.05, 1.9]} color="#b8a9e0" />
      <Fireflies count={compact ? 10 : 18} radius={3.6} />
      {complete && <SparkleField position={[0, 1.2, 0]} color="#ffe7b0" count={36} scale={6} />}
      {config.scene3.items.map((item) => {
        const found = discoveredGardenItems.includes(item.id);
        return (
          <Float key={item.id} speed={found ? 1.6 : 0.9} floatIntensity={0.16} rotationIntensity={0.3}>
            <Hotspot
              onSelect={() => {
                markGardenItem(item.id);
                openModal({ title: item.title, body: item.placeholderNote });
              }}
            >
              <group position={item.position}>
                <GardenKeepsake id={item.id} color={item.color} found={found} />
                <pointLight color={item.color} intensity={found ? 2.4 : 1.1} distance={2.8} />
              </group>
            </Hotspot>
          </Float>
        );
      })}
    </group>
  );
}

function LittleThingMesh({ id, color }: { id: string; color: string }) {
  if (id === 'collect-1') {
    return (
      <mesh>
        <torusKnotGeometry args={[0.14, 0.04, 48, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
      </mesh>
    );
  }
  if (id === 'collect-2') {
    return (
      <group>
        <mesh position={[-0.08, 0, 0]}>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.1, 0.04, 0.05]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#efe6d6" emissive={color} emissiveIntensity={0.35} />
        </mesh>
      </group>
    );
  }
  if (id === 'collect-3') {
    return (
      <group>
        <mesh position={[-0.07, 0.04, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} />
        </mesh>
        <mesh position={[0.07, 0.04, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} />
        </mesh>
        <mesh position={[0, -0.08, 0]} rotation={[0, 0, Math.PI / 4]}>
          <coneGeometry args={[0.14, 0.18, 4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} />
        </mesh>
      </group>
    );
  }
  if (id === 'collect-4') {
    return (
      <mesh>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} flatShading />
      </mesh>
    );
  }
  return (
    <mesh rotation={[0, 0.4, 0.2]}>
      <coneGeometry args={[0.14, 0.32, 5]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
    </mesh>
  );
}

function Collectible({
  id,
  name,
  message,
  position,
  color,
}: {
  id: string;
  name: { en: string; vi: string };
  message: { en: string; vi: string };
  position: Vec3;
  color: string;
}) {
  const { collectedGameItems, collectGameItem, openModal, config, openChest } = useUniverseStore();
  const [flying, setFlying] = useState(false);
  const ref = useRef<THREE.Group>(null);
  const finished = useRef(false);
  const collected = collectedGameItems.includes(id);

  useFrame(() => {
    if (!flying || !ref.current || finished.current) return;
    ref.current.position.lerp(new THREE.Vector3(0, 1.15, 0), 0.08);
    ref.current.scale.multiplyScalar(0.94);
    if (ref.current.scale.x < 0.08) {
      finished.current = true;
      collectGameItem(id);
      const nextCount = collectedGameItems.includes(id) ? collectedGameItems.length : collectedGameItems.length + 1;
      if (nextCount >= config.scene4.collectibles.length) openChest();
      openModal({ title: name, body: message });
      setFlying(false);
    }
  });

  if (collected) return null;

  return (
    <group ref={ref} position={position}>
      <Float speed={1.5} floatIntensity={flying ? 0 : 0.3} rotationIntensity={0.7}>
        <Hotspot onSelect={() => setFlying(true)}>
          <LittleThingMesh id={id} color={color} />
          <Glow color={color} scale={0.38} opacity={0.22} />
          <pointLight color={color} intensity={1.4} distance={2.2} />
        </Hotspot>
      </Float>
    </group>
  );
}

export function Chapter4({ compact }: { compact: boolean }) {
  const { config, collectedGameItems, chestOpened } = useUniverseStore();
  const all = chestOpened || collectedGameItems.length >= config.scene4.collectibles.length;

  return (
    <group>
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <cylinderGeometry args={[6.1, 5.2, 0.55, 32]} />
        <meshStandardMaterial color="#1c2240" roughness={1} />
      </mesh>
      <mesh position={[0, -0.14, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.6, 36]} />
        <meshStandardMaterial color="#2a3550" roughness={1} />
      </mesh>
      <GrassTufts count={compact ? 36 : 64} radius={5} color="#3f6a58" />
      <Rock position={[-2.4, -0.05, -1.8]} scale={1.4} />
      <Rock position={[2.8, -0.05, -2.1]} scale={1.1} />
      <Rock position={[1.6, -0.02, 2.6]} scale={0.8} />
      <Mushroom position={[-3.1, -0.05, 1.4]} color="#9dffc8" />
      <Mushroom position={[3.3, -0.05, 1.8]} color="#f4b8c8" />
      <StylizedTree position={[-4.2, -0.1, -2.4]} scale={0.9} leaf="#355e4a" />
      <StylizedTree position={[4.4, -0.1, -1.6]} scale={0.75} leaf="#3f6e52" />
      <StylizedCharacter position={[0, -0.05, 0.2]} cloakColor="#d7c4ff" />
      <pointLight position={[0, 4.5, 0]} color="#c9d7ff" intensity={3.2} distance={12} />
      {config.scene4.collectibles.map((c) => (
        <Collectible key={c.id} id={c.id} name={c.name} message={c.message} position={c.position} color={c.color} />
      ))}
      {all && (
        <group position={[0, 2.4, 0]}>
          {config.scene4.collectibles.map((c, i) => {
            const a = (i / config.scene4.collectibles.length) * Math.PI * 2;
            return (
              <mesh key={c.id} position={[Math.cos(a) * 1.1, Math.sin(a * 2) * 0.15, Math.sin(a) * 1.1]}>
                <sphereGeometry args={[0.08, 10, 10]} />
                <meshBasicMaterial color={c.color} />
              </mesh>
            );
          })}
          <SparkleField color="#ffe7b0" count={24} scale={2.4} />
        </group>
      )}
    </group>
  );
}

function LetterCard({
  position,
  read,
  main,
  onOpen,
}: {
  position: Vec3;
  read: boolean;
  main?: boolean;
  onOpen: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const open = read ? 1 : 0.08 + Math.sin(clock.elapsedTime * 1.4) * 0.02;
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y || 0.2, 0.35 + open * 0.65, 0.12);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, read ? -0.35 : -0.08, 0.08);
  });
  return (
    <Hotspot onSelect={onOpen}>
      <group ref={ref} position={position}>
        <mesh>
          <boxGeometry args={[main ? 0.72 : 0.52, 0.7, 0.02]} />
          <meshStandardMaterial
            color={read ? '#ffe7b0' : '#fff6ea'}
            emissive="#f6b96e"
            emissiveIntensity={read ? 0.45 : 0.18}
            roughness={0.75}
          />
        </mesh>
        {[0.12, 0.02, -0.08, -0.18].map((y) => (
          <mesh key={y} position={[0, y, 0.012]}>
            <boxGeometry args={[main ? 0.5 : 0.34, 0.012, 0.001]} />
            <meshBasicMaterial color={read ? '#c9a36a' : '#cbb89a'} />
          </mesh>
        ))}
      </group>
    </Hotspot>
  );
}

export function Chapter5({ compact }: { compact: boolean }) {
  const { config, readLetters, markLetterRead, openModal } = useUniverseStore();
  const curtain = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (curtain.current) curtain.current.rotation.y = -0.35 + Math.sin(clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group>
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[8.2, 0.18, 6.4]} />
        <meshStandardMaterial color="#3a2a22" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, -3.05]} receiveShadow>
        <boxGeometry args={[8.2, 3.6, 0.18]} />
        <meshStandardMaterial color="#4a3340" roughness={0.85} />
      </mesh>
      <mesh position={[-4.05, 1.7, 0]} receiveShadow>
        <boxGeometry args={[0.18, 3.6, 6.4]} />
        <meshStandardMaterial color="#3d2a38" roughness={0.85} />
      </mesh>
      <mesh position={[4.05, 1.7, 0]} receiveShadow>
        <boxGeometry args={[0.18, 3.6, 6.4]} />
        <meshStandardMaterial color="#3d2a38" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.45, 0]}>
        <boxGeometry args={[8.2, 0.12, 6.4]} />
        <meshStandardMaterial color="#2a1c28" />
      </mesh>
      <mesh position={[0, 1.85, -2.92]}>
        <circleGeometry args={[1.15, 28]} />
        <meshBasicMaterial color="#0b1230" />
      </mesh>
      <SparkleField position={[0, 1.85, -2.9]} color="#c9d7ff" count={compact ? 10 : 18} scale={2.2} />
      <mesh ref={curtain} position={[-1.35, 1.7, -2.82]}>
        <planeGeometry args={[1.1, 2.6]} />
        <meshStandardMaterial color="#7a3d4e" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.42, 1.35]}>
        <boxGeometry args={[2.2, 0.12, 1.1]} />
        <meshStandardMaterial color="#6b4634" roughness={0.7} />
      </mesh>
      <mesh position={[-0.7, 0.22, 1.35]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#4a2e22" />
      </mesh>
      <mesh position={[0.7, 0.22, 1.35]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#4a2e22" />
      </mesh>
      <group position={[-2.6, 1.5, -2.7]}>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <mesh key={`${row}-${col}`} position={[col * 0.28, -row * 0.32, 0.08]}>
              <boxGeometry args={[0.22, 0.28, 0.08]} />
              <meshStandardMaterial color={col % 2 ? '#d7c4a3' : '#8b3d4a'} />
            </mesh>
          ))
        )}
      </group>
      <group position={[-2.15, 0.55, 0.9]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.05, 0.18, 8]} />
          <meshStandardMaterial color="#efe6d6" />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffb060" />
        </mesh>
        <pointLight color="#ffb060" intensity={compact ? 3 : 5.5} distance={4.5} />
      </group>
      <group position={[2.2, 0.55, 0.7]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.05, 0.18, 8]} />
          <meshStandardMaterial color="#efe6d6" />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#ffc07a" />
        </mesh>
        <pointLight color="#ffc07a" intensity={2.4} distance={3.5} />
      </group>
      <Fireflies count={compact ? 6 : 10} radius={2.2} />
      {config.scene5.letters.map((l) => (
        <LetterCard
          key={l.id}
          position={l.position}
          read={readLetters.includes(l.id)}
          main={l.isMainHandwritten}
          onOpen={() => {
            markLetterRead(l.id);
            openModal({
              title: l.title,
              body: { en: letterBody(l, 'en'), vi: letterBody(l, 'vi') },
            });
          }}
        />
      ))}
    </group>
  );
}

function Portal({
  position,
  color,
  visited,
  onOpen,
  theme,
}: {
  position: Vec3;
  color: string;
  visited: boolean;
  onOpen: () => void;
  theme: number;
}) {
  const inner = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!inner.current) return;
    const mat = inner.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.35 + Math.sin(clock.elapsedTime * 1.4 + theme) * 0.12;
    inner.current.rotation.z = clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={0.5} floatIntensity={0.08} rotationIntensity={0.04}>
      <Hotspot onSelect={onOpen}>
        <group position={position}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.72, 0.07, 10, 28, Math.PI]} />
            <meshStandardMaterial color="#d7c4a3" roughness={0.45} metalness={0.15} />
          </mesh>
          <mesh position={[-0.72, -0.55, 0]}>
            <boxGeometry args={[0.1, 1.15, 0.1]} />
            <meshStandardMaterial color="#cbb48a" />
          </mesh>
          <mesh position={[0.72, -0.55, 0]}>
            <boxGeometry args={[0.1, 1.15, 0.1]} />
            <meshStandardMaterial color="#cbb48a" />
          </mesh>
          <mesh ref={inner} position={[0, 0.05, 0]}>
            <circleGeometry args={[0.62, 24]} />
            <meshBasicMaterial color={color} transparent opacity={visited ? 0.62 : 0.38} side={THREE.DoubleSide} />
          </mesh>
          <Glow color={color} scale={0.9} opacity={visited ? 0.28 : 0.14} />
          <pointLight color={color} intensity={visited ? 2.2 : 1.1} distance={3} />
          {theme === 0 && (
            <mesh position={[0, -0.2, 0.02]} scale={0.18}>
              <cylinderGeometry args={[0.5, 0.5, 0.2, 12]} />
              <meshBasicMaterial color="#6b4634" />
            </mesh>
          )}
          {theme === 1 && (
            <mesh position={[0, -0.15, 0.02]} scale={0.2}>
              <coneGeometry args={[0.4, 0.7, 4]} />
              <meshBasicMaterial color="#8b3d4a" />
            </mesh>
          )}
          {theme === 2 && (
            <mesh position={[0, -0.1, 0.02]} scale={0.22}>
              <sphereGeometry args={[0.4, 12, 8]} />
              <meshBasicMaterial color="#80d8ff" />
            </mesh>
          )}
          {theme === 3 && (
            <mesh position={[0, 0, 0.02]} scale={0.16}>
              <boxGeometry args={[1.2, 0.5, 0.2]} />
              <meshBasicMaterial color="#b8a9e0" />
            </mesh>
          )}
          {theme === 4 && (
            <mesh position={[0, -0.15, 0.02]} scale={0.2}>
              <sphereGeometry args={[0.35, 8, 8]} />
              <meshBasicMaterial color="#ffd280" />
            </mesh>
          )}
        </group>
      </Hotspot>
    </Float>
  );
}

export function Chapter6({ compact }: { compact: boolean }) {
  const { config, visitedDoors, markDoorVisited, openModal } = useUniverseStore();

  return (
    <group>
      <mesh position={[0, -0.7, -2]} rotation={[-Math.PI / 2.6, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 22]} />
        <meshStandardMaterial color="#3d4a62" roughness={1} />
      </mesh>
      <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7.5, 40]} />
        <meshStandardMaterial color="#4a6a52" roughness={1} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[-0.2, -0.08, 3.2 - i * 0.85]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.85]} />
          <meshStandardMaterial color="#cbb48a" />
        </mesh>
      ))}
      <group position={[-2.4, 0, -3.2]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[1.6, 1.2, 1.4]} />
          <meshStandardMaterial color="#d7c4a3" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.35, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.25, 0.9, 4]} />
          <meshStandardMaterial color="#8b3d4a" />
        </mesh>
        <mesh position={[0.45, 0.5, 0.72]}>
          <planeGeometry args={[0.28, 0.38]} />
          <meshBasicMaterial color="#ffe7b0" />
        </mesh>
        <pointLight position={[0.4, 0.5, 0.9]} color="#ffe7b0" intensity={1.4} distance={3} />
      </group>
      <Flower position={[-3.4, 0, -2.4]} color="#f4b8c8" sway={0.5} />
      <Flower position={[-1.3, 0, -2.6]} color="#ffd280" sway={1.4} />
      <StylizedTree position={[3.6, 0, -2.8]} scale={1.15} />
      <StylizedTree position={[4.4, 0, -1.2]} scale={0.85} leaf="#4a7a58" />
      <GrassTufts count={compact ? 30 : 55} radius={6.2} />
      {!compact && <ParallaxClouds compact={compact} />}
      {config.scene6.doorways.map((d, i) => (
        <Portal
          key={d.id}
          position={d.position}
          color={d.color}
          visited={visitedDoors.includes(d.id)}
          theme={i}
          onOpen={() => {
            markDoorVisited(d.id);
            openModal({
              title: d.title,
              body: {
                en: `${d.dreamDescription.en}\n\n${d.personalNotePlaceholder.en}`,
                vi: `${d.dreamDescription.vi}\n\n${d.personalNotePlaceholder.vi}`,
              },
            });
          }}
        />
      ))}
    </group>
  );
}

export function Chapter7({ compact }: { compact: boolean }) {
  return <Chapter2 compact={compact} finale />;
}
