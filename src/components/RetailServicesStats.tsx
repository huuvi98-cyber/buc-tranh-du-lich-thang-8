import { motion } from 'motion/react';
import { InfographicData, NumberAnimationStyle } from '../types';
import { AnimatedNumber } from './AnimatedNumber';
import { RollingNumber } from './RollingDigit';

interface RetailServicesStatsProps {
  data: InfographicData['retailSection'];
  triggerKey: number | string;
  speed: number;
  soundEnabled: boolean;
  numberStyle: NumberAnimationStyle;
}

export function RetailServicesStats({
  data,
  triggerKey,
  speed,
  soundEnabled,
  numberStyle,
}: RetailServicesStatsProps) {
  return (
    <div className="w-full mt-3 sm:mt-5 pt-3 border-t border-blue-900/60">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 / speed, delay: 0.85 / speed }}
        className="text-sky-300 text-lg sm:text-2xl font-extrabold tracking-tight mb-3 text-center sm:text-left font-condensed"
      >
        {data.title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left main metric: 5.235 ngàn tỷ đồng, tăng 13,3% */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 / speed, delay: 0.95 / speed }}
          className="md:col-span-4 flex flex-col justify-center items-center sm:items-start text-center sm:text-left pr-0 md:pr-4"
        >
          <div className="text-[#38bdf8] text-5xl sm:text-6xl font-extrabold tracking-tighter font-condensed leading-none">
            {numberStyle === 'odometer' ? (
              <RollingNumber
                valueString="5.235"
                delay={0.95 / speed}
                triggerKey={triggerKey}
              />
            ) : (
              <AnimatedNumber
                value={data.totalValue}
                useThousandsSeparator={true}
                duration={1600 / speed}
                delay={900 / speed}
                triggerKey={triggerKey}
                soundEnabled={soundEnabled}
              />
            )}
          </div>

          <div className="text-white font-bold text-lg sm:text-xl font-condensed mt-1">
            {data.totalUnit}
          </div>

          <div className="text-sky-200 font-bold text-base sm:text-lg font-condensed">
            {data.totalChangePrefix}{' '}
            <AnimatedNumber
              value={data.totalChangePercent}
              decimals={1}
              suffix="%"
              duration={1300 / speed}
              delay={1100 / speed}
              triggerKey={triggerKey}
              className="text-sky-300 font-extrabold"
            />
          </div>
        </motion.div>

        {/* Right breakdown with vertical light blue bracket */}
        <div className="md:col-span-8 relative flex items-stretch">
          {/* Animated SVG blue bracket [ */}
          <div className="w-5 flex-shrink-0 flex items-center justify-center mr-2 select-none">
            <svg
              className="w-full h-full min-h-[140px] overflow-visible"
              viewBox="0 0 20 160"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 18 4 L 4 4 L 4 156 L 18 156"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.8"
                strokeLinecap="square"
                strokeLinejoin="miter"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7 / speed, delay: 1.05 / speed, ease: 'easeInOut' }}
              />
            </svg>
          </div>

          {/* 4 Detail Items */}
          <div className="flex-1 flex flex-col justify-between space-y-2 py-1">
            {data.items.map((item, index) => {
              const itemDelay = (1.1 + index * 0.18) / speed;

              return (
                <motion.div
                  key={`${item.id}-${triggerKey}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45 / speed, delay: itemDelay }}
                  className="flex flex-wrap items-baseline gap-x-1.5 text-[15px] sm:text-[17px] leading-relaxed text-white font-normal hover:bg-blue-900/30 rounded px-1 -mx-1 transition-colors"
                >
                  <span className="text-white font-medium">{item.prefix}</span>
                  <span className="text-[#38bdf8] font-bold font-condensed text-lg sm:text-xl">
                    <AnimatedNumber
                      value={item.value}
                      useThousandsSeparator={item.value >= 1000}
                      duration={1300 / speed}
                      delay={itemDelay * 1000}
                      triggerKey={triggerKey}
                      soundEnabled={false}
                    />
                  </span>
                  <span className="text-sky-100/90">{item.unit}</span>
                  <span className="text-sky-300 font-bold inline-flex items-center gap-0.5 ml-0.5">
                    <span className="text-xs text-sky-400">▲</span>
                    <AnimatedNumber
                      value={item.changePercent}
                      decimals={1}
                      suffix="%"
                      duration={1200 / speed}
                      delay={(itemDelay + 0.1) * 1000}
                      triggerKey={triggerKey}
                      soundEnabled={false}
                    />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
