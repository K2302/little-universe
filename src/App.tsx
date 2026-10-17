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
    markLetterRead,
    markDoorVisited,
    collectGameItem,
    openChest,
    visitedStars,
    discoveredGardenItems,
    collectedGameItems,
    readLetters,
    visitedDoors,
  } = useUniverseStore();

  const handleNextScene = () => {
    soundEngine.startAmbient(isMuted);
    soundEngine.playChime(currentScene, isMuted);
    if (currentScene < 7) {
      setScene((currentScene + 1) as SceneId);
    }
  };

  const ui = config.ui;
  const overlayCard =
    'bg-slate-950/50 backdrop-blur-md rounded-2xl border border-white/10 px-3 py-2 sm:px-4 sm:py-3';
  const chip =
    'text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-amber-300/30 text-amber-100 transition leading-tight max-w-full';
  const quote = 'font-serif text-sm sm:text-base text-pink-100 whitespace-pre-line line-clamp-4 sm:line-clamp-5';
  const foundGarden = discoveredGardenItems.length;
  const foundThings = collectedGameItems.length;
  const totalThings = config.scene4.collectibles.length;

  const keepScroll = {
    onWheel: (e: React.WheelEvent) => e.stopPropagation(),
    onTouchMove: (e: React.TouchEvent) => e.stopPropagation(),
  };

  return (
    <div className="relative flex flex-col w-full h-full min-h-0 overflow-hidden select-none font-sans">
      {!lowPowerMode ? (
        <div className="absolute inset-0">
          <UniverseCanvas />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#070918] via-[#181438] to-[#2e1d3a] flex items-center justify-center p-4 sm:p-6">
          <div className="text-center max-w-md text-pink-100/80 text-sm whitespace-pre-line">
            {tBlock(ui.lowPowerNote, lang)}
          </div>
        </div>
      )}

      <header className="relative z-20 shrink-0 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 pt-[max(0.5rem,env(safe-area-inset-top))] bg-slate-950/60 backdrop-blur-md border-b border-white/10">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="font-serif italic text-sm sm:text-lg text-pink-200 truncate min-w-0">
            {tLine(ui.headerTitle, lang)}
          </span>
          <span className="shrink-0 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-white/10 text-amber-200 max-w-[55%] sm:max-w-none truncate">
            {tLine(ui.sceneTitles[currentScene], lang)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
          <div className="flex rounded-full bg-white/10 p-0.5" role="tablist" aria-label="Language">
            {LANGS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLang(opt.id)}
                className={`px-2 sm:px-2.5 py-1 rounded-full transition ${
                  lang === opt.id ? 'bg-amber-300 text-slate-950' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={toggleMute}
            className="px-2 sm:px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {tLine(isMuted ? ui.soundMuted : ui.soundOn, lang)}
          </button>
          <button
            onClick={toggleReducedMotion}
            className="px-2 sm:px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {tLine(reducedMotion ? ui.motionReduced : ui.motionFull, lang)}
          </button>
          <button
            onClick={toggleLowPowerMode}
            className="px-2 sm:px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {tLine(lowPowerMode ? ui.mode2d : ui.mode3d, lang)}
          </button>
        </div>
      </header>

      <main className="relative z-10 pointer-events-none flex flex-col flex-1 min-h-0 px-3 py-3 sm:p-6 gap-3">
        <div className="shrink-0 flex flex-col items-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentScene}-${lang}`}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="lu-scroll w-full max-w-md mx-auto text-center pointer-events-auto max-h-[28dvh] sm:max-h-[30dvh]"
            {...keepScroll}
          >
            {currentScene === 1 && (
              <div className={`${overlayCard} space-y-1.5`}>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 1.4 }}
                  className="font-serif italic text-sm sm:text-lg text-amber-200 whitespace-pre-line"
                >
                  {tBlock(config.scene1.openingLine2, lang)}
                </motion.p>
                <p className="font-sans text-[10px] sm:text-xs text-slate-300">
                  {lang === 'vi' ? 'chạm một ngôi sao sáng để mở câu chuyện' : lang === 'en' ? 'tap a glowing star to open the next line of the story' : 'tap a glowing star · chạm ngôi sao sáng'}
                </p>
              </div>
            )}

            {currentScene === 2 && (
              <div className={overlayCard}>
                <p className={quote}>
                  {tBlock(config.scene2.quote, lang)}
                </p>
                <p className="font-sans text-[11px] sm:text-xs text-slate-300 mt-2 whitespace-pre-line">
                  {tBlock(config.scene2.subtitle, lang)}
                </p>
                <p className="font-sans text-[11px] text-amber-100/80 mt-1">
                  {visitedStars.length} / {config.scene2.stars.length}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-2">
                  {config.scene2.stars.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        markStarVisited(s.id);
                        openModal({ title: s.title, body: s.content });
                      }}
                      className={chip}
                    >
                      ★ {tLine(s.label, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 3 && (
              <div className={overlayCard}>
                <p className={quote}>
                  {tBlock(config.scene3.completionQuote, lang)}
                </p>
                <p className="font-sans text-[11px] text-amber-100/80 mt-1">
                  {foundGarden} / {config.scene3.items.length}
                  {foundGarden >= config.scene3.items.length ? (lang === 'vi' ? ' · vườn sáng hết rồi' : ' · the garden is lit') : ''}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-2">
                  {config.scene3.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        markGardenItem(item.id);
                        openModal({ title: item.title, body: item.placeholderNote });
                      }}
                      className={`${chip} hover:bg-pink-400/30 text-pink-100`}
                    >
                      ✿ {tLine(item.objectName, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 4 && (
              <div className={overlayCard}>
                <h2 className="font-serif text-base sm:text-lg text-amber-200">{tLine(config.scene4.title, lang)}</h2>
                <p className="font-sans text-[11px] sm:text-xs text-slate-300 mt-1 whitespace-pre-line">
                  {tBlock(config.scene4.instructions, lang)}
                </p>
                <p className="font-sans text-xs sm:text-sm text-amber-100 mt-2">
                  {foundThings} of {totalThings} little things found
                  {lang !== 'en' ? ` · tìm được ${foundThings} / ${totalThings}` : ''}
                </p>
                {foundThings >= totalThings && (
                  <p className="text-[11px] sm:text-xs text-amber-100/80 mt-1 whitespace-pre-line">
                    {tBlock(config.scene4.chestMessage, lang)}
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-2">
                  {config.scene4.collectibles.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        collectGameItem(c.id);
                        if (collectedGameItems.length + (collectedGameItems.includes(c.id) ? 0 : 1) >= totalThings) {
                          openChest();
                        }
                        openModal({ title: c.name, body: c.message });
                      }}
                      className={chip}
                    >
                      ✦ {tLine(c.name, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 5 && (
              <div className={overlayCard}>
                <h2 className="font-serif text-base sm:text-lg text-pink-100">{tLine(config.scene5.roomTitle, lang)}</h2>
                <p className="font-sans text-[11px] text-slate-300 mt-1">
                  {lang === 'vi' ? 'mở thư theo thứ tự em muốn. thư tay để cuối.' : 'open the letters in any order. save the handwritten one for last.'}
                </p>
                <p className="font-sans text-[11px] text-amber-100/80">{readLetters.length} / {config.scene5.letters.length}</p>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-2">
                  {config.scene5.letters.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        markLetterRead(l.id);
                        openModal({
                          title: l.title,
                          body: { en: letterBody(l, 'en'), vi: letterBody(l, 'vi') },
                        });
                      }}
                      className={chip}
                    >
                      ✉ {tLine(l.title, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 6 && (
              <div className={overlayCard}>
                <p className={`${quote} text-amber-100`}>
                  {tBlock(config.scene6.quoteLine1, lang)}
                </p>
                <p className="font-sans text-[11px] text-amber-100/80 mt-1">{visitedDoors.length} / {config.scene6.doorways.length}</p>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-2">
                  {config.scene6.doorways.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        markDoorVisited(d.id);
                        openModal({
                          title: d.title,
                          body: {
                            en: `${d.dreamDescription.en}\n\n${d.personalNotePlaceholder.en}`,
                            vi: `${d.dreamDescription.vi}\n\n${d.personalNotePlaceholder.vi}`,
                          },
                        });
                      }}
                      className={chip}
                    >
                      🚪 {tLine(d.label, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentScene === 7 && (
              <div className={overlayCard}>
                <h2 className="font-serif text-base sm:text-lg text-amber-200 whitespace-pre-line">
                  {giftOpened ? `★ ${config.herName.toUpperCase()} ★` : tBlock(config.scene7.giftPrompt, lang)}
                </h2>
                {giftOpened && (
                  <p className="font-sans text-[11px] sm:text-xs text-slate-300 mt-1">
                    {lang === 'vi' ? 'em chọn lúc mở thư cuối.' : 'open the final letter whenever you are ready.'}
                  </p>
                )}
                <button
                  onClick={() => setFinalLetterOpen(true)}
                  className="mt-3 w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-amber-300 text-slate-950 font-medium text-sm"
                >
                  {tLine(ui.openFinalLetter, lang)}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
        <div className="flex-1 min-h-0 pointer-events-none" />

        {!lowPowerMode && !activeModal && !finalLetterOpen && (
          <p className="pointer-events-none shrink-0 text-center text-[11px] sm:text-xs text-amber-100/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] px-3 whitespace-pre-line">
            {tLine(ui.rotateHint, lang)}
          </p>
        )}

        <div className="pointer-events-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 max-w-2xl w-full mx-auto bg-slate-950/80 backdrop-blur-md px-3 py-2.5 sm:px-5 sm:py-3 mb-[env(safe-area-inset-bottom)] rounded-2xl sm:rounded-full border border-white/10">
          <div className="flex justify-center gap-1 sm:gap-1.5">
            {([1, 2, 3, 4, 5, 6, 7] as SceneId[]).map((sc) => (
              <button
                key={sc}
                onClick={() => setScene(sc)}
                className={`w-8 h-8 sm:w-7 sm:h-7 rounded-full text-xs font-medium transition ${
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
              className="px-4 py-2 sm:py-1.5 rounded-full bg-pink-400/20 border border-pink-300/40 text-pink-100 text-[11px] sm:text-xs hover:bg-pink-400/30 transition whitespace-normal sm:whitespace-nowrap leading-tight"
            >
              {tLine(ui.continueJourney, lang)}
            </button>
          ) : (
            <button
              onClick={resetExperience}
              className="px-4 py-2 sm:py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-100 text-[11px] sm:text-xs hover:bg-amber-400/30 transition whitespace-normal sm:whitespace-nowrap leading-tight"
            >
              {tLine(ui.replay, lang)}
            </button>
          )}
        </div>
      </main>

      {activeModal && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4">
          <div
            className="lu-scroll bg-slate-900 border border-white/15 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 max-h-[88dvh]"
            {...keepScroll}
          >
            <h3 className="font-serif text-xl sm:text-2xl text-amber-200 whitespace-pre-line">
              {tBlock(activeModal.title, lang)}
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {tBlock(activeModal.body, lang)}
            </p>
            <button
              onClick={() => closeModal()}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs"
            >
              {tLine(ui.keepExploring, lang)}
            </button>
          </div>
        </div>
      )}

      {finalLetterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl">
          <div className="lu-scroll flex-1 min-h-0 p-4 sm:p-6 md:p-12" {...keepScroll}>
          <div className="max-w-2xl w-full mx-auto bg-slate-900/80 border border-amber-200/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 space-y-4 sm:space-y-5 text-center">
            {config.scene7.finalLetterParagraphs.map((para, i) => (
              <p
                key={i}
                className="font-serif text-base sm:text-xl md:text-2xl text-pink-50 leading-relaxed whitespace-pre-line"
              >
                {tBlock(para, lang)}
              </p>
            ))}
            <p className="font-handwriting text-xl sm:text-2xl text-amber-200 pt-2 sm:pt-4 whitespace-pre-line">
              {tBlock(config.scene7.signoffLine, lang)}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 pt-4 sm:pt-6">
              <button
                onClick={() => setFinalLetterOpen(false)}
                className="px-5 py-2.5 sm:py-2 rounded-full bg-white/10 text-xs"
              >
                {tLine(ui.backToBridge, lang)}
              </button>
              <button
                onClick={resetExperience}
                className="px-6 py-2.5 sm:py-2 rounded-full bg-gradient-to-r from-pink-400 to-amber-300 text-slate-950 font-medium text-xs"
              >
                {tLine(ui.replay, lang)}
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {subtitleText && (
        <div className="fixed bottom-24 sm:bottom-20 left-1/2 -translate-x-1/2 z-30 max-w-[90vw] px-3 py-1 rounded-full bg-black/70 text-[11px] sm:text-xs text-amber-200 text-center">
          {subtitleText}
        </div>
      )}
    </div>
  );
}
