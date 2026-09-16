import { motion } from 'motion/react';

interface HeaderBannerProps {
  title: string;
  subtitle: string;
  triggerKey: number | string;
  speed: number;
}

export function HeaderBanner({ title, subtitle, triggerKey, speed }: HeaderBannerProps) {
  return (
    <div className="relative w-full mb-3 select-none overflow-hidden py-1">
      {/* Slanted blue ribbon badge */}
      <motion.div
        key={`banner-${triggerKey}`}
        initial={{ x: '-100%', opacity: 0.6 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.7 / speed,
          ease: [0.16, 1, 0.3, 1], // easeOutExpo
        }}
        className="relative inline-block w-full max-w-[560px] bg-gradient-to-r from-[#0f3465] via-[#154586] to-[#1b55a4] text-white shadow-lg border-l-4 border-[#38bdf8]"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 93% 100%, 0 100%)',
          padding: '12px 42px 12px 20px',
        }}
      >
        {/* Subtle light glint shimmer animation */}
        <motion.div
          initial={{ x: '-150%' }}
          animate={{ x: '250%' }}
          transition={{ duration: 1.4 / speed, delay: 0.5 / speed, ease: 'easeInOut' }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] pointer-events-none"
        />

        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 / speed, delay: 0.2 / speed }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none font-condensed uppercase text-white"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 / speed, delay: 0.35 / speed }}
          className="text-sm sm:text-base font-semibold text-sky-200 mt-1 font-condensed tracking-wide"
        >
          {subtitle.includes('(') ? (
            <>
              <span className="font-bold">{subtitle.split('(')[0]}</span>
              <span className="italic font-normal">({subtitle.split('(')[1]}</span>
            </>
          ) : (
            subtitle
          )}
        </motion.p>
      </motion.div>
    </div>
  );
}
