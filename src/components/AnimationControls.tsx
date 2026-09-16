import { RotateCcw, Volume2, VolumeX, Play, Pause, Sliders, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { NumberAnimationStyle } from '../types';

interface AnimationControlsProps {
  onReplay: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  autoLoop: boolean;
  onToggleAutoLoop: () => void;
  numberStyle: NumberAnimationStyle;
  onNumberStyleChange: (style: NumberAnimationStyle) => void;
  onOpenEdit: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function AnimationControls({
  onReplay,
  speed,
  onSpeedChange,
  soundEnabled,
  onToggleSound,
  autoLoop,
  onToggleAutoLoop,
  numberStyle,
  onNumberStyleChange,
  onOpenEdit,
  isFullscreen,
  onToggleFullscreen,
}: AnimationControlsProps) {
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-3 py-2.5 bg-[#091b34]/95 backdrop-blur-md rounded-2xl border border-[#1a3a66] shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs text-white">
      {/* Left: Playback controls */}
      <div className="flex items-center gap-2">
        {/* Replay Button */}
        <button
          onClick={onReplay}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all duration-150 shadow-sm cursor-pointer hover:shadow active:scale-95"
          title="Phát lại toàn bộ hiệu ứng nhảy số"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Phát lại</span>
        </button>

        {/* Auto loop toggle */}
        <button
          onClick={onToggleAutoLoop}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all duration-150 cursor-pointer ${
            autoLoop
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
              : 'bg-[#061326] hover:bg-[#0c213f] text-sky-200 border border-blue-900/40'
          }`}
          title="Tự động lặp lại hoạt họa sau mỗi 6 giây"
        >
          {autoLoop ? <Pause className="w-3.5 h-3.5 text-emerald-300" /> : <Play className="w-3.5 h-3.5" />}
          <span>Tự động lặp</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
            soundEnabled
              ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
              : 'bg-[#061326] hover:bg-[#0c213f] text-sky-300/80 border border-blue-900/40'
          }`}
          title={soundEnabled ? 'Tắt âm thanh tích tắc' : 'Bật âm thanh tích tắc khi nhảy số'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Middle: Speed & Style toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Speed Selector */}
        <div className="flex items-center bg-[#061326] p-0.5 rounded-xl border border-blue-900/40">
          <span className="text-sky-300/70 font-medium px-2 hidden sm:inline">Tốc độ:</span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                speed === s
                  ? 'bg-sky-500 text-slate-950 shadow-xs'
                  : 'text-sky-200/80 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Number Animation Mode Toggle */}
        <div className="flex items-center bg-[#061326] p-0.5 rounded-xl border border-blue-900/40">
          <button
            onClick={() => onNumberStyleChange('jump-smooth')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              numberStyle === 'jump-smooth'
                ? 'bg-sky-500 text-slate-950 shadow-xs font-bold'
                : 'text-sky-200/80 hover:text-white'
            }`}
            title="Đếm số mượt mà tăng dần với gia tốc mượt"
          >
            Nhịp số mượt
          </button>
          <button
            onClick={() => onNumberStyleChange('odometer')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              numberStyle === 'odometer'
                ? 'bg-sky-500 text-slate-950 shadow-xs font-bold'
                : 'text-sky-200/80 hover:text-white'
            }`}
            title="Lăn con số kiểu công tơ mét / slot ticker"
          >
            Con lăn Odometer
          </button>
        </div>
      </div>

      {/* Right: Customization & View mode */}
      <div className="flex items-center gap-2">
        {/* Edit Data Button */}
        <button
          onClick={onOpenEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061326] hover:bg-[#0c213f] text-sky-100 font-medium border border-blue-900/40 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span>Sửa số liệu</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-xl bg-[#061326] hover:bg-[#0c213f] text-sky-200 border border-blue-900/40 transition-colors cursor-pointer"
          title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình trình chiếu'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
