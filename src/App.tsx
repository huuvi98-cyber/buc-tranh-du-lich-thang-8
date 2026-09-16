import { useState, useCallback } from 'react';
import { initialInfographicData } from './data/defaultData';
import { InfographicData, NumberAnimationStyle } from './types';
import { HeaderBanner } from './components/HeaderBanner';
import { InfographicDonut } from './components/InfographicDonut';
import { RetailServicesStats } from './components/RetailServicesStats';
import { soundManager } from './utils/audio';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [data] = useState<InfographicData>(initialInfographicData);
  const [triggerKey, setTriggerKey] = useState<number>(0);
  const speed = 1;
  const soundEnabled = false;
  const numberStyle: NumberAnimationStyle = 'jump-smooth';

  // Trigger animation replay
  const handleReplay = useCallback(() => {
    setTriggerKey((prev) => prev + 1);
    if (soundEnabled) {
      soundManager.playChime();
    }
  }, [soundEnabled]);

  return (
    <div className="min-h-screen bg-[#0c223f] flex flex-col items-center justify-center p-2 sm:p-6 transition-colors selection:bg-sky-500 selection:text-slate-950">
      {/* Main Infographic Canvas Card (Strictly only the graphic frame) */}
      <div
        id="infographic-canvas"
        className="w-full max-w-4xl bg-[#123661] rounded-2xl shadow-2xl border border-[#1d4f8a] overflow-hidden relative p-4 sm:p-7 transition-all"
      >
        {/* Subtle decorative background watermark glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* In-frame discreet replay button inside the graphic frame (top-right) */}
        <button
          onClick={handleReplay}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white transition-all cursor-pointer border border-sky-400/20 backdrop-blur-xs shadow-sm hover:scale-105 active:scale-95"
          title="Phát lại hiệu ứng nhảy số"
          aria-label="Phát lại hiệu ứng nhảy số"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 1. Header Blue Ribbon Banner */}
        <HeaderBanner
          title={data.title}
          subtitle={data.subtitle}
          triggerKey={triggerKey}
          speed={speed}
        />

        {/* 2. Donut Chart with Circular Motion & Jumping Numbers */}
        <InfographicDonut
          segments={data.segments}
          centralStat={data.centralStat}
          triggerKey={triggerKey}
          speed={speed}
          soundEnabled={soundEnabled}
          numberStyle={numberStyle}
        />

        {/* 3. Retail & Services Stats Section */}
        <RetailServicesStats
          data={data.retailSection}
          triggerKey={triggerKey}
          speed={speed}
          soundEnabled={soundEnabled}
          numberStyle={numberStyle}
        />
      </div>
    </div>
  );
}
