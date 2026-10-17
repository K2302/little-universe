import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Stars, useCursor } from '@react-three/drei';
import { SceneId } from '../../store/useUniverseStore';

type Vec3 = [number, number, number];

export const SCENE_PALETTES: Record<
  SceneId,
  {
    bg: string;
    fog: string;
    fogNear: number;
    fogFar: number;
    ambient: number;
    hemiSky: string;
    hemiGround: string;
    key: string;
    fill: string;
    accent: string;
  }
> = {
  1: {
    bg: '#050714',
    fog: '#07091c',
    fogNear: 14,
    fogFar: 48,
    ambient: 0.2,
    hemiSky: '#8ea2ff',
    hemiGround: '#1a1028',
    key: '#ffe0b8',
    fill: '#6d7cff',
    accent: '#ff7eb6',
  },
  2: {
    bg: '#07101c',
    fog: '#0b1524',
    fogNear: 12,
    fogFar: 40,
    ambient: 0.3,
    hemiSky: '#9ecbff',
    hemiGround: '#1c1830',
    key: '#f3d7b0',
    fill: '#6ec8ff',
    accent: '#ff9ec8',
  },
  3: {
    bg: '#120c16',
    fog: '#1a1220',
    fogNear: 8,
    fogFar: 30,
    ambient: 0.34,
    hemiSky: '#ffd4b0',
    hemiGround: '#241820',
    key: '#ffd9a8',
    fill: '#8898ff',
    accent: '#ffb3d0',
  },
  4: {
    bg: '#080b18',
    fog: '#101428',
    fogNear: 9,
    fogFar: 32,
    ambient: 0.26,
    hemiSky: '#c9d7ff',
    hemiGround: '#161428',
    key: '#dce6ff',
    fill: '#6b7cff',
    accent: '#9dffc8',
  },
  5: {
    bg: '#0a0708',
    fog: '#160e10',
    fogNear: 5,
    fogFar: 16,
    ambient: 0.14,
    hemiSky: '#ffd0a0',
    hemiGround: '#1a1010',
    key: '#ffc07a',
    fill: '#3a2a48',
    accent: '#ff9a4a',
  },
  6: {
    bg: '#18122c',
    fog: '#2a1c3c',
    fogNear: 11,
    fogFar: 42,
    ambient: 0.46,
    hemiSky: '#ffd8b8',
    hemiGround: '#2a2038',
    key: '#ffe0b0',
    fill: '#90b4ff',
    accent: '#ffb0d0',
  },
  7: {
    bg: '#0a0816',
    fog: '#141028',
    fogNear: 11,
    fogFar: 44,
    ambient: 0.32,
    hemiSky: '#c8b8ff',
    hemiGround: '#1a1430',
    key: '#ffdcb8',
    fill: '#8aa0ff',
    accent: '#ff9ac8',
  },
};

const SHOTS: Record<
  SceneId,
  { start: Vec3; idle: Vec3; startCompact: Vec3; idleCompact: Vec3; look: Vec3; gift: Vec3; giftCompact: Vec3 }
> = {
  1: {
    start: [0, 6.4, 22],
    idle: [0, 2.35, 9.4],
    startCompact: [0, 7.2, 24],
    idleCompact: [0, 3.5, 12.2],
    look: [0, 0.7, -2.4],
    gift: [0, 2.35, 9.4],
    giftCompact: [0, 3.5, 12.2],
  },
  2: {
    start: [0, 9.5, 18],
    idle: [0, 3.6, 12.2],
    startCompact: [0, 10.2, 20],
    idleCompact: [0, 4.6, 14],
    look: [0, 0.7, 0],
    gift: [0, 3.6, 12.2],
    giftCompact: [0, 4.6, 14],
  },
  3: {
    start: [0, 9.2, 16],
    idle: [0, 5.6, 12.4],
    startCompact: [0, 10, 18],
    idleCompact: [0, 6.6, 14.5],
    look: [0, 0.2, 0],
    gift: [0, 5.6, 12.4],
    giftCompact: [0, 6.6, 14.5],
  },
  4: {
    start: [0, 11, 16],
    idle: [0, 4.4, 12],
    startCompact: [0, 11.5, 18],
    idleCompact: [0, 5.4, 14],
    look: [0, 0.4, 0],
    gift: [0, 4.4, 12],
    giftCompact: [0, 5.4, 14],
  },
  5: {
    start: [0, 3.8, 11],
    idle: [0, 2.15, 6.6],
    startCompact: [0, 4.4, 12.5],
    idleCompact: [0, 2.7, 8.1],
    look: [0, 1.25, -0.2],
    gift: [0, 2.15, 6.6],
    giftCompact: [0, 2.7, 8.1],
  },
  6: {
    start: [6, 7.2, 16],
    idle: [1.2, 3.1, 11.5],
    startCompact: [5, 8, 18],
    idleCompact: [0.6, 4.2, 13.5],
    look: [0, 0.9, -1.4],
    gift: [1.2, 3.1, 11.5],
    giftCompact: [0.6, 4.2, 13.5],
  },
  7: {
    start: [0, 11, 22],
    idle: [0, 3.4, 11.4],
    startCompact: [0, 12, 24],
    idleCompact: [0, 4.6, 13.8],
    look: [0, 0.85, 0],
    gift: [0, 1.7, 5.4],
    giftCompact: [0, 2.3, 7],
  },
};

export function useIsCompact() {
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

export function makeRadialTexture(color = '#ffffff', size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.45, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function makePlanetTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();
  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, '#3a2a68');
  base.addColorStop(0.4, '#6b4fa0');
  base.addColorStop(0.7, '#c47aa8');
  base.addColorStop(1, '#f0b48a');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2400; i++) {
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(i * 78.233) * 23421.631) % 1;
    const px = Math.abs(x) * size;
    const py = Math.abs(y) * size;
    const r = 4 + (i % 14);
    ctx.fillStyle = i % 5 === 0 ? 'rgba(255,210,160,0.18)' : i % 3 === 0 ? 'rgba(80,50,140,0.22)' : 'rgba(180,120,200,0.12)';
    ctx.beginPath();
    ctx.ellipse(px, py, r, r * 0.6, i, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function Hotspot({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
}

export function CameraRig({
  scene,
  compact,
  giftOpened,
  reducedMotion,
}: {
  scene: SceneId;
  compact: boolean;
  giftOpened: boolean;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const [intro, setIntro] = useState(!reducedMotion);
  const look = useRef(new THREE.Vector3());
  const goal = useRef(new THREE.Vector3());

  useLayoutEffect(() => {
    const shot = SHOTS[scene];
    const start = compact ? shot.startCompact : shot.start;
    camera.position.set(...start);
    look.current.set(...shot.look);
    goal.current.set(...(compact ? shot.idleCompact : shot.idle));
    if (controls.current) controls.current.target.copy(look.current);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = compact ? 58 : 46;
      camera.updateProjectionMatrix();
    }
    setIntro(!reducedMotion);
    const t = window.setTimeout(() => setIntro(false), reducedMotion ? 0 : 3000);
    return () => window.clearTimeout(t);
  }, [scene, compact, reducedMotion, camera]);

  useFrame((_, dt) => {
    const shot = SHOTS[scene];
    const idle = compact ? shot.idleCompact : shot.idle;
    const gift = compact ? shot.giftCompact : shot.gift;
    goal.current.set(...(giftOpened && scene === 7 ? gift : idle));
    look.current.lerp(new THREE.Vector3(...shot.look), 1 - Math.exp(-dt * 2.2));
    if (intro || (giftOpened && scene === 7)) {
      camera.position.lerp(goal.current, 1 - Math.exp(-dt * 1.05));
    }
    if (controls.current) controls.current.target.copy(look.current);
  });

  return (
    <OrbitControls
      ref={controls}
      enabled={!intro}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 1.92}
      minPolarAngle={Math.PI / 5.5}
      minDistance={compact ? 5.2 : 3.6}
      maxDistance={compact ? 20 : 18}
      rotateSpeed={compact ? 0.58 : 0.88}
    />
  );
}

export function CinematicLights({
  scene,
  compact,
  dim,
}: {
  scene: SceneId;
  compact: boolean;
  dim: boolean;
}) {
  const p = SCENE_PALETTES[scene];
  return (
    <>
      <color attach="background" args={[dim ? '#040308' : p.bg]} />
      <fog attach="fog" args={[dim ? '#08060e' : p.fog, dim ? 6 : p.fogNear, dim ? 18 : p.fogFar]} />
      <ambientLight intensity={dim ? 0.08 : p.ambient} />
      <hemisphereLight args={[p.hemiSky, p.hemiGround, dim ? 0.12 : 0.55]} />
      <directionalLight
        position={[6, 10, 5]}
        intensity={dim ? 0.25 : compact ? 0.9 : 1.2}
        color={p.key}
        castShadow={!compact}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-6, 3, -4]} color={p.fill} intensity={dim ? 2 : compact ? 6 : 10} distance={22} />
      <pointLight position={[5, 2, 2]} color={p.accent} intensity={dim ? 1.2 : compact ? 3.5 : 5.5} distance={16} />
    </>
  );
}

function ForegroundSparks({ compact }: { compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const count = compact ? 18 : 36;
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: [
          Math.sin(i * 19.12) * 7.5,
          0.4 + ((i * 13) % 11) * 0.28,
          2.2 - ((i * 5) % 9) * 0.55,
        ] as Vec3,
        scale: 0.018 + (i % 4) * 0.01,
      })),
    [count]
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.22) * 0.1;
    group.current.rotation.y = clock.elapsedTime * 0.02;
  });

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#ffd9a0' : i % 3 === 1 ? '#f5a8d1' : '#c5d0ff'}
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function LayeredStars({ compact, dense = false }: { compact: boolean; dense?: boolean }) {
  return (
    <>
      <Stars
        radius={90}
        depth={48}
        count={compact ? 500 : dense ? 2200 : 1600}
        factor={1.5}
        saturation={0.35}
        fade
        speed={0.35}
      />
      <Stars
        radius={32}
        depth={14}
        count={compact ? 180 : 420}
        factor={3.1}
        saturation={0.7}
        fade
        speed={0.7}
      />
      {!compact && <ForegroundSparks compact={compact} />}
    </>
  );
}

export function NebulaClouds({ compact }: { compact: boolean }) {
  const tex = useMemo(() => makeRadialTexture('#ffffff', 160), []);
  const group = useRef<THREE.Group>(null);
  const clouds = useMemo(
    () =>
      (compact ? [0, 1, 2] : [0, 1, 2, 3, 4]).map((i) => ({
        position: [Math.sin(i * 1.7) * 8, 1.4 + (i % 3) * 1.1, -8 - i * 1.6] as Vec3,
        scale: [5.5 + i, 3.2 + (i % 2), 1] as Vec3,
        color: i % 2 ? '#7a4fa8' : '#c45f8a',
        speed: 0.04 + i * 0.01,
      })),
    [compact]
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.position.x = clouds[i].position[0] + Math.sin(clock.elapsedTime * clouds[i].speed) * 0.8;
      child.rotation.z = Math.sin(clock.elapsedTime * 0.08 + i) * 0.08;
    });
  });

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.position} scale={c.scale} renderOrder={-1}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={tex}
            color={c.color}
            transparent
            opacity={0.22}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ParallaxClouds({ compact }: { compact: boolean }) {
  const far = useRef<THREE.Group>(null);
  const near = useRef<THREE.Group>(null);
  const count = compact ? 4 : 7;
  const puffs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: [-10 + i * 3.2, 2.4 + (i % 3) * 0.7, -6 - (i % 2) * 3] as Vec3,
        scale: 1.1 + (i % 3) * 0.35,
      })),
    [count]
  );

  useFrame(({ clock }) => {
    if (far.current) far.current.position.x = Math.sin(clock.elapsedTime * 0.03) * 1.6;
    if (near.current) near.current.position.x = Math.sin(clock.elapsedTime * 0.07) * 2.4;
  });

  return (
    <>
      <group ref={far}>
        {puffs.map((p, i) => (
          <mesh key={`f-${i}`} position={[p.position[0], p.position[1] + 1.2, p.position[2] - 4]} scale={p.scale * 1.4}>
            <sphereGeometry args={[0.7, 10, 8]} />
            <meshStandardMaterial color="#c9d7ea" transparent opacity={0.18} roughness={1} />
          </mesh>
        ))}
      </group>
      <group ref={near}>
        {puffs.map((p, i) => (
          <mesh key={`n-${i}`} position={p.position} scale={p.scale}>
            <sphereGeometry args={[0.55, 10, 8]} />
            <meshStandardMaterial color="#e8eef8" transparent opacity={0.28} roughness={1} />
          </mesh>
        ))}
      </group>
    </>
  );
}

export function Glow({ color, scale = 1, opacity = 0.28 }: { color: string; scale?: number; opacity?: number }) {
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

export function StylizedTree({
  position,
  scale = 1,
  leaf = '#3d6b55',
  trunk = '#5c4033',
}: {
  position: Vec3;
  scale?: number;
  leaf?: string;
  trunk?: string;
}) {
  const top = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (top.current) top.current.rotation.z = Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.05;
  });
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.075, 0.68, 6]} />
        <meshStandardMaterial color={trunk} roughness={1} />
      </mesh>
      <group ref={top} position={[0, 0.72, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <icosahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color={leaf} roughness={1} flatShading />
        </mesh>
        <mesh position={[0.14, 0.32, 0.04]} scale={0.68} castShadow>
          <icosahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color={leaf} roughness={1} flatShading />
        </mesh>
      </group>
    </group>
  );
}

export function Flower({
  position,
  color,
  sway = 0,
  bloom = 1,
}: {
  position: Vec3;
  color: string;
  sway?: number;
  bloom?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.1 + sway) * 0.14;
    const s = 0.85 + bloom * 0.35;
    ref.current.scale.setScalar(s);
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.01, 0.014, 0.22, 5]} />
        <meshStandardMaterial color="#3a6b48" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[Math.sin((i / 5) * Math.PI * 2) * 0.045, 0.24, Math.cos((i / 5) * Math.PI * 2) * 0.045]}
          scale={0.04}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45 * bloom} />
        </mesh>
      ))}
    </group>
  );
}

export function GrassTufts({
  count,
  radius,
  color = '#4d7a62',
}: {
  count: number;
  radius: number;
  color?: string;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 6.2;
      const r = (0.2 + ((i * 17) % 80) / 80) * radius;
      dummy.position.set(Math.cos(a) * r, 0.08, Math.sin(a) * r * 0.86);
      dummy.rotation.set(0.15, a, 0.08);
      dummy.scale.setScalar(0.7 + (i % 4) * 0.18);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy, radius]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.035, 0.16, 3]} />
      <meshStandardMaterial color={color} roughness={1} />
    </instancedMesh>
  );
}

export function Fireflies({ count = 16, radius = 3.4 }: { count?: number; radius?: number }) {
  const group = useRef<THREE.Group>(null);
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: i * 1.7,
        radius: radius * (0.35 + (i % 5) * 0.12),
        y: 0.35 + (i % 4) * 0.28,
        speed: 0.35 + (i % 6) * 0.08,
      })),
    [count, radius]
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const d = data[i];
      const t = clock.elapsedTime * d.speed + d.offset;
      child.position.set(Math.cos(t) * d.radius, d.y + Math.sin(t * 1.7) * 0.18, Math.sin(t * 0.9) * d.radius);
    });
  });

  return (
    <group ref={group}>
      {data.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={i % 2 ? '#ffe9a0' : '#c8ffd4'} />
        </mesh>
      ))}
    </group>
  );
}

export function Mushroom({ position, color = '#f4b8c8' }: { position: Vec3; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.16, 6]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} roughness={0.4} />
      </mesh>
      <pointLight color={color} intensity={0.55} distance={1.6} position={[0, 0.2, 0]} />
    </group>
  );
}

export function Rock({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  return (
    <mesh position={position} scale={scale} rotation={[0.1, 0.4, 0.05]} castShadow>
      <dodecahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color="#6b6578" roughness={1} flatShading />
    </mesh>
  );
}

export function StarBurst({ position }: { position: Vec3; alive?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const life = useRef(0);
  useFrame((_, dt) => {
    if (!ref.current) return;
    life.current = Math.min(1, life.current + dt * 1.35);
    ref.current.scale.setScalar(0.2 + life.current * 2.4);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.7 * (1 - life.current);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#ffe9b8" transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

export function SparkleField({
  position,
  color,
  count,
  scale,
}: {
  position?: Vec3;
  color: string;
  count: number;
  scale: number;
}) {
  return (
    <Sparkles position={position} color={color} count={count} scale={scale} size={2.4} speed={0.4} opacity={0.7} />
  );
}
