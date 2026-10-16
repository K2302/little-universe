import { create } from 'zustand';
import { Bi, defaultExperienceData, ExperienceConfig, LangMode } from '../config/experienceData';

export type SceneId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

function loadLang(): LangMode {
  try {
    const v = localStorage.getItem('universe-lang');
    if (v === 'en' || v === 'vi' || v === 'both') return v;
  } catch {
    /* ignore */
  }
  return 'both';
}

interface UniverseState {
  currentScene: SceneId;
  config: ExperienceConfig;
  lang: LangMode;
  visitedStars: string[];
  discoveredGardenItems: string[];
  collectedGameItems: string[];
  chestOpened: boolean;
  readLetters: string[];
  visitedDoors: string[];
  giftOpened: boolean;
  finalLetterOpen: boolean;
  isMuted: boolean;
  reducedMotion: boolean;
  lowPowerMode: boolean;
  subtitleText: string | null;
  activeModal: { title: Bi; body: Bi } | null;
  setScene: (scene: SceneId) => void;
  setLang: (lang: LangMode) => void;
  openModal: (modal: { title: Bi; body: Bi }) => void;
  closeModal: () => void;
  markStarVisited: (id: string) => void;
  markGardenItem: (id: string) => void;
  collectGameItem: (id: string) => void;
  openChest: () => void;
  markLetterRead: (id: string) => void;
  markDoorVisited: (id: string) => void;
  openGift: () => void;
  setFinalLetterOpen: (open: boolean) => void;
  toggleMute: () => void;
  toggleReducedMotion: () => void;
  toggleLowPowerMode: () => void;
  triggerSubtitle: (text: string) => void;
  updateConfig: (partial: Partial<ExperienceConfig>) => void;
  resetExperience: () => void;
}

export const useUniverseStore = create<UniverseState>((set) => ({
  currentScene: 1,
  config: defaultExperienceData,
  lang: loadLang(),
  visitedStars: [],
  discoveredGardenItems: [],
  collectedGameItems: [],
  chestOpened: false,
  readLetters: [],
  visitedDoors: [],
  giftOpened: false,
  finalLetterOpen: false,
  isMuted: false,
  reducedMotion: false,
  lowPowerMode: false,
  subtitleText: null,
  activeModal: null,

  setScene: (scene) => set({ currentScene: scene }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  setLang: (lang) => {
    try {
      localStorage.setItem('universe-lang', lang);
    } catch {
      /* ignore */
    }
    set({ lang });
  },
  markStarVisited: (id) =>
    set((s) => ({
      visitedStars: s.visitedStars.includes(id) ? s.visitedStars : [...s.visitedStars, id],
    })),
  markGardenItem: (id) =>
    set((s) => ({
      discoveredGardenItems: s.discoveredGardenItems.includes(id)
        ? s.discoveredGardenItems
        : [...s.discoveredGardenItems, id],
    })),
  collectGameItem: (id) =>
    set((s) => ({
      collectedGameItems: s.collectedGameItems.includes(id)
        ? s.collectedGameItems
        : [...s.collectedGameItems, id],
    })),
  openChest: () => set({ chestOpened: true }),
  markLetterRead: (id) =>
    set((s) => ({
      readLetters: s.readLetters.includes(id) ? s.readLetters : [...s.readLetters, id],
    })),
  markDoorVisited: (id) =>
    set((s) => ({
      visitedDoors: s.visitedDoors.includes(id) ? s.visitedDoors : [...s.visitedDoors, id],
    })),
  openGift: () => set({ giftOpened: true }),
  setFinalLetterOpen: (open) => set({ finalLetterOpen: open }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
  toggleLowPowerMode: () => set((s) => ({ lowPowerMode: !s.lowPowerMode })),
  triggerSubtitle: (text) => set({ subtitleText: text }),
  updateConfig: (partial) => set((s) => ({ config: { ...s.config, ...partial } })),
  resetExperience: () =>
    set({
      currentScene: 1,
      visitedStars: [],
      discoveredGardenItems: [],
      collectedGameItems: [],
      chestOpened: false,
      readLetters: [],
      visitedDoors: [],
      giftOpened: false,
      finalLetterOpen: false,
      activeModal: null,
    }),
}));
