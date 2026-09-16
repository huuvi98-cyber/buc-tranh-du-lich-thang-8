import { useEffect, useState, useRef } from 'react';
import { soundManager } from '../utils/audio';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  useThousandsSeparator?: boolean;
  prefix?: string;
  suffix?: string;
  duration?: number; // in milliseconds
  delay?: number; // in milliseconds
  triggerKey?: number | string; // change this key to re-trigger
  soundEnabled?: boolean;
  className?: string;
  styleMode?: 'jump-smooth' | 'odometer' | 'staccato';
  onComplete?: () => void;
}

export function formatVietnameseNumber(
  val: number,
  decimals = 0,
  useThousands = false
): string {
  if (isNaN(val)) return '0';

  let fixed = val.toFixed(decimals);

  if (decimals > 0) {
    const parts = fixed.split('.');
    let intPart = parts[0];
    const decPart = parts[1];

    if (useThousands) {
      intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return `${intPart},${decPart}`;
  } else {
    if (useThousands) {
      return Math.round(val)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return Math.round(val).toString();
  }
}

export function AnimatedNumber({
  value,
  decimals = 0,
  useThousandsSeparator = false,
  prefix = '',
  suffix = '',
  duration = 1800,
  delay = 0,
  triggerKey = 0,
  soundEnabled = false,
  className = '',
  styleMode = 'jump-smooth',
  onComplete,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);
  const lastSoundTick = useRef<number>(0);

  useEffect(() => {
    // Reset
    setDisplayValue(0);
    setIsFinished(false);
    setIsJumping(true);

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const startVal = 0;
      const targetVal = value;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease Out Quart for dramatic smooth deceleration
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = startVal + (targetVal - startVal) * ease;

        setDisplayValue(current);

        // Sound effect on tick
        if (soundEnabled && progress < 1) {
          if (now - lastSoundTick.current > 60) {
            lastSoundTick.current = now;
            soundManager.playTick(600 + progress * 400);
          }
        }

        if (progress < 1) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetVal);
          setIsFinished(true);
          setIsJumping(false);
          if (soundEnabled) {
            soundManager.playTick(1200);
          }
          if (onComplete) onComplete();
        }
      };

      animRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [value, duration, delay, triggerKey, soundEnabled, onComplete]);

  const formatted = formatVietnameseNumber(displayValue, decimals, useThousandsSeparator);

  return (
    <span
      className={`inline-flex items-baseline font-digit transition-transform duration-100 ${
        isJumping && !isFinished ? 'scale-[1.03] text-sky-200' : ''
      } ${className}`}
    >
      {prefix && <span>{prefix}</span>}
      <span className="tabular-nums tracking-tight">{formatted}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
