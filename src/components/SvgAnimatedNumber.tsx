import { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import { formatVietnameseNumber } from './AnimatedNumber';

interface SvgAnimatedNumberProps {
  value: number;
  decimals?: number;
  useThousandsSeparator?: boolean;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  triggerKey?: number | string;
  soundEnabled?: boolean;
  x: number | string;
  y: number | string;
  textAnchor?: 'start' | 'middle' | 'end';
  fontSize?: number | string;
  fontWeight?: string | number;
  fill?: string;
  jumpingFill?: string;
  fontFamily?: string;
  className?: string;
}

export function SvgAnimatedNumber({
  value,
  decimals = 0,
  useThousandsSeparator = false,
  prefix = '',
  suffix = '',
  duration = 1500,
  delay = 0,
  triggerKey = 0,
  soundEnabled = false,
  x,
  y,
  textAnchor = 'start',
  fontSize = 32,
  fontWeight = 'bold',
  fill = '#ffffff',
  jumpingFill = '#38bdf8',
  fontFamily = 'Barlow Condensed, Be Vietnam Pro, sans-serif',
  className = '',
}: SvgAnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);
  const lastSoundTick = useRef<number>(0);

  useEffect(() => {
    setDisplayValue(0);
    setIsJumping(true);

    const timer = setTimeout(() => {
      const startTime = performance.now();
      const startVal = 0;
      const targetVal = value;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease Out Quart curve
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = startVal + (targetVal - startVal) * ease;
        setDisplayValue(current);

        if (soundEnabled && progress < 1) {
          if (now - lastSoundTick.current > 70) {
            lastSoundTick.current = now;
            soundManager.playTick(650 + progress * 400);
          }
        }

        if (progress < 1) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetVal);
          setIsJumping(false);
          if (soundEnabled) {
            soundManager.playTick(1100);
          }
        }
      };

      animRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [value, duration, delay, triggerKey, soundEnabled]);

  const formatted = formatVietnameseNumber(displayValue, decimals, useThousandsSeparator);

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fill={isJumping ? jumpingFill : fill}
      fontFamily={fontFamily}
      className={`select-none transition-colors duration-150 ${className}`}
      style={{ fontFeatureSettings: '"tnum" 1, "lnum" 1' }}
    >
      {prefix}
      {formatted}
      {suffix}
    </text>
  );
}
