import { useCallback, useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Overview } from './sections/Overview';
import { DataAccess } from './sections/DataAccess';
import { QueryEditor } from './sections/QueryEditor';
import { PolyNotebook } from './sections/PolyNotebook';
import { DataNotebook } from './sections/DataNotebook';
import { UnifiedWorkflow } from './sections/UnifiedWorkflow';
import { BeforeAfter } from './sections/BeforeAfter';
import { Architecture } from './sections/Architecture';
import { NAV_META, NAV_ORDER, type NavKey } from './data/mock';

const SHORTCUT_MAP: Record<string, NavKey> = Object.fromEntries(
  NAV_ORDER.map((k) => [NAV_META[k].shortcut, k]),
);

const TOUR_INTERVAL_MS = 6500;

export default function App() {
  const [active, setActive] = useState<NavKey>('overview');
  const [tourRunning, setTourRunning] = useState(false);
  const tourTimer = useRef<number | null>(null);

  const goTo = useCallback((key: NavKey) => setActive(key), []);

  const stopTour = useCallback(() => {
    if (tourTimer.current) {
      window.clearInterval(tourTimer.current);
      tourTimer.current = null;
    }
    setTourRunning(false);
  }, []);

  const startTour = useCallback(() => {
    setTourRunning(true);
    setActive('overview');
    let idx = 0;
    tourTimer.current = window.setInterval(() => {
      idx = (idx + 1) % NAV_ORDER.length;
      setActive(NAV_ORDER[idx]);
      if (idx === 0) {
        // Loop complete; stop at overview.
        if (tourTimer.current) window.clearInterval(tourTimer.current);
        tourTimer.current = null;
        setTourRunning(false);
      }
    }, TOUR_INTERVAL_MS);
  }, []);

  const toggleTour = useCallback(() => {
    if (tourRunning) stopTour();
    else startTour();
  }, [tourRunning, startTour, stopTour]);

  useEffect(() => () => stopTour(), [stopTour]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? '';
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (SHORTCUT_MAP[e.key]) {
        setActive(SHORTCUT_MAP[e.key]);
        return;
      }
      if (e.key === 'ArrowRight') {
        const i = NAV_ORDER.indexOf(active);
        if (i < NAV_ORDER.length - 1) setActive(NAV_ORDER[i + 1]);
      } else if (e.key === 'ArrowLeft') {
        const i = NAV_ORDER.indexOf(active);
        if (i > 0) setActive(NAV_ORDER[i - 1]);
      } else if (e.key.toLowerCase() === 't') {
        toggleTour();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, toggleTour]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        active={active}
        onChange={(k) => {
          stopTour();
          goTo(k);
        }}
        onStartTour={toggleTour}
        tourRunning={tourRunning}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          active={active}
          tourRunning={tourRunning}
          onChange={(k) => {
            stopTour();
            goTo(k);
          }}
        />
        <div className="flex-1 overflow-auto p-6">
          {active === 'overview' && <Overview />}
          {active === 'data-access' && <DataAccess />}
          {active === 'query-editor' && <QueryEditor />}
          {active === 'poly-notebook' && <PolyNotebook />}
          {active === 'data-notebook' && <DataNotebook />}
          {active === 'unified-workflow' && <UnifiedWorkflow />}
          {active === 'before-after' && <BeforeAfter />}
          {active === 'architecture' && <Architecture />}
        </div>
      </main>
    </div>
  );
}
