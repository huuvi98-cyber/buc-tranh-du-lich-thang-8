import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface RollingDigitProps {
  key?: React.Key;
  char: string;
  delay?: number;
  duration?: number;
  triggerKey?: number | string;
  className?: string;
}

export function RollingDigit({
  char,
  delay = 0,
  duration = 1.2,
  triggerKey = 0,
  className = '',
}: RollingDigitProps) {
  const isDigit = /\d/.test(char);
  const targetNum = isDigit ? parseInt(char, 10) : 0;
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(false);
    const t = setTimeout(() => {
      setAnimating(true);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [triggerKey, delay]);

  if (!isDigit) {
    return <span className={className}>{char}</span>;
  }

  // We can render numbers 0..9 repeating twice for a rolling effect
  // 0,1,2,3,4,5,6,7,8,9, 0,1,2,3,4,5,6,7,8,9
  // Height per digit is 1em
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Target position: second lap + targetNum
  const targetIndex = 10 + targetNum;

  return (
    <span
      className={`inline-block overflow-hidden relative align-baseline ${className}`}
      style={{ height: '1.15em', verticalAlign: '-0.12em' }}
    >
      <motion.span
        className="flex flex-col select-none"
        initial={{ y: 0 }}
        animate={
          animating
            ? { y: `-${targetIndex * 1.15}em` }
            : { y: 0 }
        }
        transition={{
          duration,
          ease: [0.16, 1, 0.3, 1], // easeOutExpo
        }}
      >
        {numbers.map((n, idx) => (
          <span
            key={idx}
            className="flex items-center justify-center tabular-nums leading-none"
            style={{ height: '1.15em' }}
          >
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

interface RollingNumberProps {
  valueString: string;
  delay?: number;
  triggerKey?: number | string;
  className?: string;
}

export function RollingNumber({
  valueString,
  delay = 0,
  triggerKey = 0,
  className = '',
}: RollingNumberProps) {
  const chars = valueString.split('');

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {chars.map((ch, idx) => (
        <RollingDigit
          key={`${idx}-${ch}`}
          char={ch}
          delay={delay + idx * 0.08}
          triggerKey={triggerKey}
        />
      ))}
    </span>
  );
}
