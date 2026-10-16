import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUniverseStore, SceneId } from './store/useUniverseStore';
import { UniverseCanvas } from './components/three/UniverseCanvas';
import { soundEngine } from './audio/soundEngine';
import { LangMode, letterBody, tBlock, tLine } from './config/experienceData';

const LANGS: { id: LangMode; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'vi', label: 'VI' },
  { id: 'both', label: 'EN+VI' },
];

export default function App() {
  const {
    currentScene,
    setScene,
    config,
    lang,
    setLang,
    isMuted,
    toggleMute,
    reducedMotion,
    toggleReducedMotion,
    lowPowerMode,
    toggleLowPowerMode,
    subtitleText,
    giftOpened,
    finalLetterOpen,
    setFinalLetterOpen,
    resetExperience,
    activeModal,
    openModal,
    closeModal,
    markStarVisited,
    markGardenItem,
  } = useUniverseStore();

  const handleNextScene = () => {
    soundEngine.startAmbient(isMuted);
    soundEngine.playChime(currentScene, isMuted);
    if (currentScene < 7) {
      setScene((currentScene + 1) as SceneId);
    }
  };

  const ui = config.ui;

  return (
    <div className="relative w-full h-full overflow-hidden select-none font-sans">
      {!lowPowerMode ? (
        <div className="absolute inset-0">
          <UniverseCanvas />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#070918] via-[#181438] to-[#2e1d3a] flex items-center justify-center p-6">
          <div className="text-center max-w-md text-pink-100/80 text-sm whitespace-pre-line">
            {tBlock(ui.lowPowerNote, lang)}
          </div>
        </div>
      )}

      <header className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-950/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-lg text-pink-200">
            {tLine(ui.headerTitle, lang)}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-amber-200">
            {tLine(ui.sceneTitles[currentScene], lang)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex rounded-full bg-white/10 p-0.5" role="tablist" aria-label="Language">
            {LANGS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLang(opt.id)}
                className={`px-2.5 py-1 rounded-full transition ${
                  lang === opt.id ? 'bg-amber-300 text-slate-950' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={toggleMute}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {tLine(isMuted ? ui.soundMuted : ui.soundOn, lang)}
          </button>
          <button
            onClick={toggleReducedMotion}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {tLine(reducedMotion ? ui.motionReduced : ui.motionFull, lang)}
          </button>
          <button
            onClick={toggleLowPowerMode}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {tLine(lowPowerMode ? ui.mode2d : ui.mode3d, lang)}
          </button>
        </div>
      </header>

      <main className="relative z-10 pointer-events-none flex flex-col justify-between h-[calc(100%-60px)] p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScene}-${lang}`}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto text-center mt-4 pointer-events-auto"
          >
            {currentScene === 1 && (
              <div className="space-y-6 mt-16 bg-slate-950/60 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                <p className="font-serif text-2xl md:text-3xl leading-relaxed text-pink-100 whitespace-pre-line">
                  {tBlock(config.scene1.openingLine1, lang)}
                </p>
                <p className="font-serif italic text-xl text-amber-200 whitespace-pre-line">
                  {tBlock(config.scene1.openingLine2, lang)}
                </p>
                <button
                  onClick={handleNextScene}
                  className="mt-4 px-7 py-3 rounded-full bg-gradient-to-r from-pink-400/80 to-amber-300/80 text-slate-950 font-medium shadow-lg hover:scale-105 transition"
                >
                  {tLine(config.scene1.ctaButton, lang)}
                </button>
              </div>
            )}

            {currentScene === 2 && (
              <div className="bg-slate-950/60 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <p className="font-serif text-xl md:text-2xl text-pink-100 whitespace-pre-line">
                  {tBlock(config.scene2.quote, lang)}
                </p>
                <p className="text-xs text-slate-300 mt-2 whitespace-pre-line">{tBlock(config.scene2.subtitle, lang)}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {config.scene2.stars.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        markStarVisited(s.id);
                        openModal({ title: s.title, body: s.content });
                      }}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-amber-300/30 text-amber-100 transition"
                    >
                      ★ {tLine(s.label, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 3 && (
              <div className="bg-slate-950/60 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <p className="font-serif text-xl text-pink-100 whitespace-pre-line">
                  {tBlock(config.scene3.completionQuote, lang)}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {config.scene3.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        markGardenItem(item.id);
                        openModal({ title: item.title, body: item.placeholderNote });
                      }}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-pink-400/30 text-pink-100 transition"
                    >
                      ✿ {tLine(item.objectName, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 4 && (
              <div className="bg-slate-950/60 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <h2 className="font-serif text-2xl text-amber-200">{tLine(config.scene4.title, lang)}</h2>
                <p className="text-xs text-slate-300 mt-1 whitespace-pre-line">
                  {tBlock(config.scene4.instructions, lang)}
                </p>
                <p className="text-xs text-amber-100/80 mt-2 whitespace-pre-line">
                  {tBlock(config.scene4.chestMessage, lang)}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {config.scene4.collectibles.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => openModal({ title: c.name, body: c.message })}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-amber-300/30 text-amber-100 transition"
                    >
                      ✦ {tLine(c.name, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 5 && (
              <div className="bg-slate-950/60 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <h2 className="font-serif text-2xl text-pink-100">{tLine(config.scene5.roomTitle, lang)}</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {config.scene5.letters.map((l) => (
                    <button
                      key={l.id}
                      onClick={() =>
                        openModal({
                          title: l.title,
                          body: { en: letterBody(l, 'en'), vi: letterBody(l, 'vi') },
                        })
                      }
                      className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-amber-300/30 text-amber-100 transition"
                    >
                      ✉ {tLine(l.title, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 6 && (
              <div className="bg-slate-950/60 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <p className="font-serif text-xl text-amber-100 whitespace-pre-line">
                  {tBlock(config.scene6.quoteLine1, lang)}
                  {'\n'}
                  {tBlock(config.scene6.quoteLine2, lang)}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {config.scene6.doorways.map((d) => (
                    <button
                      key={d.id}
                      onClick={() =>
                        openModal({
                          title: d.title,
                          body: {
                            en: `${d.dreamDescription.en}\n\n${d.personalNotePlaceholder.en}`,
                            vi: `${d.dreamDescription.vi}\n\n${d.personalNotePlaceholder.vi}`,
                          },
                        })
                      }
                      className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-amber-300/30 text-amber-100 transition"
                    >
                      🚪 {tLine(d.label, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 7 && (
              <div className="bg-slate-950/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <h2 className="font-serif text-2xl text-amber-200 whitespace-pre-line">
                  {giftOpened ? `★ ${config.herName.toUpperCase()} ★` : tBlock(config.scene7.giftPrompt, lang)}
                </h2>
                <button
                  onClick={() => setFinalLetterOpen(true)}
                  className="mt-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-amber-300 text-slate-950 font-medium"
                >
                  {tLine(ui.openFinalLetter, lang)}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-auto flex items-center justify-between max-w-2xl w-full mx-auto bg-slate-950/70 backdrop-blur-md px-5 py-3 rounded-full border border-white/10">
          <div className="flex gap-1.5">
            {([1, 2, 3, 4, 5, 6, 7] as SceneId[]).map((sc) => (
              <button
                key={sc}
                onClick={() => setScene(sc)}
                className={`w-7 h-7 rounded-full text-xs font-medium transition ${
                  currentScene === sc
                    ? 'bg-amber-300 text-slate-950'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
          {currentScene < 7 ? (
            <button
              onClick={handleNextScene}
              className="px-4 py-1.5 rounded-full bg-pink-400/20 border border-pink-300/40 text-pink-100 text-xs hover:bg-pink-400/30 transition"
            >
              {tLine(ui.continueJourney, lang)}
            </button>
          ) : (
            <button
              onClick={resetExperience}
              className="px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-100 text-xs hover:bg-amber-400/30 transition"
            >
              {tLine(ui.replay, lang)}
            </button>
          )}
        </div>
      </main>

      {activeModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="font-serif text-2xl text-amber-200 whitespace-pre-line">
              {tBlock(activeModal.title, lang)}
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {tBlock(activeModal.body, lang)}
            </p>
            <button
              onClick={() => closeModal()}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs"
            >
              {tLine(ui.keepExploring, lang)}
            </button>
          </div>
        </div>
      )}

      {finalLetterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl p-6 md:p-12 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-slate-900/80 border border-amber-200/20 rounded-3xl p-8 md:p-12 space-y-5 text-center">
            {config.scene7.finalLetterParagraphs.map((para, i) => (
              <p key={i} className="font-serif text-xl md:text-2xl text-pink-50 leading-relaxed whitespace-pre-line">
                {tBlock(para, lang)}
              </p>
            ))}
            <p className="font-handwriting text-2xl text-amber-200 pt-4 whitespace-pre-line">
              {tBlock(config.scene7.signoffLine, lang)}
            </p>
            <div className="flex justify-center gap-4 pt-6">
              <button
                onClick={() => setFinalLetterOpen(false)}
                className="px-5 py-2 rounded-full bg-white/10 text-xs"
              >
                {tLine(ui.backToBridge, lang)}
              </button>
              <button
                onClick={resetExperience}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-amber-300 text-slate-950 font-medium text-xs"
              >
                {tLine(ui.replay, lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {subtitleText && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 px-4 py-1 rounded-full bg-black/70 text-xs text-amber-200">
          {subtitleText}
        </div>
      )}
    </div>
  );
}
