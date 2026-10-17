import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useUniverseStore } from '../../store/useUniverseStore';
import { Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6, Chapter7 } from './ChapterScenes';
import { CameraRig, CinematicLights, LayeredStars, useIsCompact } from './sharedWorld';

export const UniverseCanvas: React.FC = () => {
  const { currentScene, giftOpened, reducedMotion } = useUniverseStore();
  const compact = useIsCompact();

  return (
    <Canvas
      shadows={!compact}
      dpr={compact ? [1, 1.2] : [1, 1.6]}
      camera={{ position: [0, compact ? 4.1 : 3.2, compact ? 11.5 : 8.5], fov: compact ? 58 : 46 }}
      gl={{ antialias: !compact, powerPreference: compact ? 'low-power' : 'high-performance' }}
    >
      <CameraRig
        scene={currentScene}
        compact={compact}
        giftOpened={giftOpened}
        reducedMotion={reducedMotion}
      />
      <CinematicLights scene={currentScene} compact={compact} dim={giftOpened && currentScene === 7} />
      <LayeredStars compact={compact} dense={currentScene === 1 || currentScene === 7} />

      {currentScene === 1 && <Chapter1 compact={compact} />}
      {currentScene === 2 && <Chapter2 compact={compact} />}
      {currentScene === 3 && <Chapter3 compact={compact} />}
      {currentScene === 4 && <Chapter4 compact={compact} />}
      {currentScene === 5 && <Chapter5 compact={compact} />}
      {currentScene === 6 && <Chapter6 compact={compact} />}
      {currentScene === 7 && <Chapter7 compact={compact} />}
    </Canvas>
  );
};
