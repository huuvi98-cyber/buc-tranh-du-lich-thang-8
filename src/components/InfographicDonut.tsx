import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DonutSegment, NumberAnimationStyle } from '../types';
import { SvgAnimatedNumber } from './SvgAnimatedNumber';

interface InfographicDonutProps {
  segments: DonutSegment[];
  centralStat: {
    prefix: string;
    value: number;
    unit: string;
    suffix: string;
    changePrefix: string;
    changePercent: number;
  };
  triggerKey: number | string;
  speed: number;
  soundEnabled: boolean;
  numberStyle: NumberAnimationStyle;
  onSliceSelect?: (segment: DonutSegment | null) => void;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeDonutArc(
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, arcSweep, 0, endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'A', innerRadius, innerRadius, 0, arcSweep, 1, startInner.x, startInner.y,
    'Z',
  ].join(' ');
}

export function InfographicDonut({
  segments,
  centralStat,
  triggerKey,
  speed,
  soundEnabled,
  onSliceSelect,
}: InfographicDonutProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Enlarged dimensions for a larger, bolder donut ring with generous text clearance
  const cx = 380;
  const cy = 235;
  const outerR = 162;
  const innerR = 114;

  // Calculate arc angles matching the image layout:
  // Asia: ~74.2% -> 267.1°
  // Europe: ~16.8% -> 60.5°
  // Americas: ~5.6% -> 20.2°
  // Others: ~3.4% -> 12.2°
  const angleLayout = useMemo(() => {
    let currentAngle = 105; // starts near bottom-right and sweeps clockwise around bottom, left, top to 12°
    const totalPercent = segments.reduce((sum, s) => sum + s.percentage, 0);

    return segments.map((seg) => {
      const sweep = (seg.percentage / totalPercent) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sweep;
      currentAngle = endAngle;

      const midAngle = startAngle + sweep / 2;
      return {
        ...seg,
        startAngle,
        endAngle,
        sweep,
        midAngle,
        path: describeDonutArc(cx, cy, innerR, outerR, startAngle, endAngle - 0.7),
        hoverPath: describeDonutArc(cx, cy, innerR - 3, outerR + 6, startAngle, endAngle - 0.7),
      };
    });
  }, [segments]);

  const baseDuration = 1.4 / speed;

  const handleHover = (id: string | null) => {
    setHoveredSegment(id);
    const seg = segments.find((s) => s.id === id) || null;
    if (onSliceSelect) onSliceSelect(seg);
  };

  const asiaSlice = segments[0] || { percentage: 74.2, label: 'Châu Á' };
  const europeSlice = segments[1] || { percentage: 16.8, label: 'Châu Âu' };
  const americasSlice = segments[2] || { percentage: 5.6, label: 'Châu Mỹ' };
  const othersSlice = segments[3] || { percentage: 3.4, label: 'Thị trường khác' };

  return (
    <div className="relative w-full max-w-[800px] mx-auto select-none py-1">
      <svg
        viewBox="0 0 840 470"
        className="w-full h-auto overflow-visible filter drop-shadow-xs"
        id="vietnam-tourism-donut-svg"
      >
        <defs>
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodOpacity="0.4" floodColor="#38bdf8" />
          </filter>
        </defs>

        {/* 1. Background track & center cutout hole */}
        <circle
          cx={cx}
          cy={cy}
          r={(outerR + innerR) / 2}
          fill="none"
          stroke="#1b4676"
          strokeWidth={outerR - innerR}
        />
        {/* Deep blue center cutout */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="#0e2a4e"
          stroke="#255e9e"
          strokeWidth="2.5"
          className="filter drop-shadow-md"
        />

        {/* 2. Donut Slices */}
        <g id="donut-slices">
          {angleLayout.map((slice, idx) => {
            const isHovered = hoveredSegment === slice.id;
            const sliceDelay = (idx * 0.14) / speed;

            return (
              <motion.path
                key={`${slice.id}-${triggerKey}`}
                id={`slice-${slice.id}`}
                d={isHovered ? slice.hoverPath : slice.path}
                fill={isHovered ? slice.hoverColor : slice.color}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: baseDuration * 0.65,
                  delay: sliceDelay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="cursor-pointer transition-colors duration-200"
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  filter: isHovered ? 'url(#soft-glow)' : undefined,
                }}
                onMouseEnter={() => handleHover(slice.id)}
                onMouseLeave={() => handleHover(null)}
                onClick={() => handleHover(isHovered ? null : slice.id)}
              />
            );
          })}
        </g>

        {/* 3. Pointer Lines & Callout Elements (Wide clearance so text never sticks to circle) */}

        {/* --- ASIA (Left Callout) --- */}
        <g
          id="callout-asia"
          className="cursor-pointer"
          onMouseEnter={() => handleHover('asia')}
          onMouseLeave={() => handleHover(null)}
        >
          {/* Pointer line with anchor dot on donut */}
          <motion.circle
            cx={cx - outerR}
            cy={cy}
            r="3.5"
            fill="#38bdf8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 / speed, duration: 0.25 }}
          />
          <motion.path
            d={`M ${cx - outerR} ${cy} L 45 ${cy}`}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35 / speed, duration: 0.45 / speed, ease: 'easeOut' }}
          />
          <motion.circle
            cx="45"
            cy={cy}
            r="3"
            fill="#38bdf8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.55 / speed, duration: 0.2 }}
          />

          {/* Asia Animated Number (Above line, well separated from circle) */}
          <SvgAnimatedNumber
            value={asiaSlice.percentage}
            decimals={1}
            suffix="%"
            x="130"
            y={cy - 14}
            textAnchor="middle"
            fontSize="44"
            fontWeight="800"
            duration={1500 / speed}
            delay={350 / speed}
            triggerKey={triggerKey}
            soundEnabled={soundEnabled}
            fill="#38bdf8"
            jumpingFill="#ffffff"
          />
          {/* Asia Label (Below line) */}
          <motion.text
            x="130"
            y={cy + 30}
            textAnchor="middle"
            fontSize="23"
            fontWeight="600"
            fill="#ffffff"
            fontFamily="Be Vietnam Pro, sans-serif"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 / speed, duration: 0.4 }}
          >
            {asiaSlice.label}
          </motion.text>
        </g>

        {/* --- EUROPE (Top-Right Callout) --- */}
        <g
          id="callout-europe"
          className="cursor-pointer"
          onMouseEnter={() => handleHover('europe')}
          onMouseLeave={() => handleHover(null)}
        >
          {/* Anchor dot on silver arc (~42 deg) */}
          <motion.circle
            cx={cx + outerR * Math.sin((42 * Math.PI) / 180)}
            cy={cy - outerR * Math.cos((42 * Math.PI) / 180)}
            r="3.5"
            fill="#93c5fd"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.45 / speed, duration: 0.25 }}
          />
          {/* Pointer line leading out right to x=810, y=85 */}
          <motion.path
            d={`M ${cx + outerR * Math.sin((42 * Math.PI) / 180)} ${cy - outerR * Math.cos((42 * Math.PI) / 180)} L 635 85 L 810 85`}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 / speed, duration: 0.45 / speed, ease: 'easeOut' }}
          />
          <motion.circle
            cx="810"
            cy="85"
            r="3"
            fill="#93c5fd"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.65 / speed, duration: 0.2 }}
          />

          {/* Europe Animated Number (Positioned clearly in right column at x=655) */}
          <SvgAnimatedNumber
            value={europeSlice.percentage}
            decimals={1}
            suffix="%"
            x="655"
            y="72"
            textAnchor="start"
            fontSize="42"
            fontWeight="800"
            duration={1400 / speed}
            delay={500 / speed}
            triggerKey={triggerKey}
            soundEnabled={soundEnabled}
            fill="#93c5fd"
            jumpingFill="#ffffff"
          />
          {/* Europe Label */}
          <motion.text
            x="655"
            y="114"
            textAnchor="start"
            fontSize="22"
            fontWeight="600"
            fill="#ffffff"
            fontFamily="Be Vietnam Pro, sans-serif"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 / speed, duration: 0.4 }}
          >
            {europeSlice.label}
          </motion.text>
        </g>

        {/* --- AMERICAS (Mid-Right Callout) --- */}
        <g
          id="callout-americas"
          className="cursor-pointer"
          onMouseEnter={() => handleHover('americas')}
          onMouseLeave={() => handleHover(null)}
        >
          {/* Connecting line stepping out to right column */}
          <motion.path
            d={`M ${cx + outerR * Math.sin((80 * Math.PI) / 180)} ${cy - outerR * Math.cos((80 * Math.PI) / 180)} L 635 207 L 635 235 L 800 235`}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.65 / speed, duration: 0.45 / speed, ease: 'easeOut' }}
          />
          <motion.circle
            cx="800"
            cy="235"
            r="3"
            fill="#60a5fa"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.75 / speed, duration: 0.2 }}
          />

          {/* Americas Animated Number (Aligned in right column at x=655) */}
          <SvgAnimatedNumber
            value={americasSlice.percentage}
            decimals={1}
            suffix="%"
            x="655"
            y="222"
            textAnchor="start"
            fontSize="40"
            fontWeight="800"
            duration={1400 / speed}
            delay={650 / speed}
            triggerKey={triggerKey}
            soundEnabled={soundEnabled}
            fill="#60a5fa"
            jumpingFill="#ffffff"
          />
          {/* Americas Label */}
          <motion.text
            x="655"
            y="260"
            textAnchor="start"
            fontSize="21"
            fontWeight="600"
            fill="#ffffff"
            fontFamily="Be Vietnam Pro, sans-serif"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 / speed, duration: 0.4 }}
          >
            {americasSlice.label}
          </motion.text>
        </g>

        {/* --- OTHER MARKETS (Bottom-Right Callout) --- */}
        <g
          id="callout-others"
          className="cursor-pointer"
          onMouseEnter={() => handleHover('others')}
          onMouseLeave={() => handleHover(null)}
        >
          {/* Leader line stepping down and out into right column */}
          <motion.path
            d={`M ${cx + outerR * Math.sin((101 * Math.PI) / 180)} ${cy - outerR * Math.cos((101 * Math.PI) / 180)} L 635 315 L 635 365 L 800 365`}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.75 / speed, duration: 0.45 / speed, ease: 'easeOut' }}
          />
          <motion.circle
            cx="800"
            cy="365"
            r="3"
            fill="#38bdf8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.85 / speed, duration: 0.2 }}
          />

          {/* Others Animated Number (Aligned in right column at x=655) */}
          <SvgAnimatedNumber
            value={othersSlice.percentage}
            decimals={1}
            suffix="%"
            x="655"
            y="352"
            textAnchor="start"
            fontSize="40"
            fontWeight="800"
            duration={1300 / speed}
            delay={800 / speed}
            triggerKey={triggerKey}
            soundEnabled={soundEnabled}
            fill="#38bdf8"
            jumpingFill="#ffffff"
          />
          {/* Others Label */}
          <motion.text
            x="655"
            y="386"
            textAnchor="start"
            fontSize="21"
            fontWeight="600"
            fill="#ffffff"
            fontFamily="Be Vietnam Pro, sans-serif"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 / speed, duration: 0.4 }}
          >
            {othersSlice.label}
          </motion.text>
        </g>

        {/* 4. Center Hole (Việt Nam đón 15,9 triệu lượt khách quốc tế, tăng 14,4%) */}
        <g id="center-hole-stat">
          <motion.text
            x={cx}
            y={cy - 50}
            textAnchor="middle"
            fontSize="22"
            fontWeight="700"
            fill="#ffffff"
            fontFamily="Be Vietnam Pro, sans-serif"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 / speed, duration: 0.4 }}
          >
            {centralStat.prefix}
          </motion.text>

          {/* Animated 15,9 */}
          <SvgAnimatedNumber
            value={centralStat.value}
            decimals={1}
            x={cx - 30}
            y={cy + 16}
            textAnchor="middle"
            fontSize="68"
            fontWeight="800"
            duration={1600 / speed}
            delay={250 / speed}
            triggerKey={triggerKey}
            soundEnabled={soundEnabled}
            fill="#38bdf8"
            jumpingFill="#ffffff"
          />

          {/* triệu */}
          <motion.text
            x={cx + 46}
            y={cy + 10}
            textAnchor="start"
            fontSize="25"
            fontWeight="700"
            fill="#ffffff"
            fontFamily="Barlow Condensed, sans-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 / speed, duration: 0.4 }}
          >
            {centralStat.unit}
          </motion.text>

          {/* lượt khách quốc tế, */}
          <motion.text
            x={cx}
            y={cy + 46}
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fill="#e0f2fe"
            fontFamily="Be Vietnam Pro, sans-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 / speed, duration: 0.4 }}
          >
            {centralStat.suffix}
          </motion.text>

          {/* tăng 14,4% */}
          <g>
            <motion.text
              x={cx - 36}
              y={cy + 75}
              textAnchor="end"
              fontSize="20"
              fontWeight="700"
              fill="#93c5fd"
              fontFamily="Be Vietnam Pro, sans-serif"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 / speed, duration: 0.4 }}
            >
              {centralStat.changePrefix}
            </motion.text>
            <SvgAnimatedNumber
              value={centralStat.changePercent}
              decimals={1}
              suffix="%"
              x={cx - 28}
              y={cy + 75}
              textAnchor="start"
              fontSize="23"
              fontWeight="800"
              duration={1400 / speed}
              delay={400 / speed}
              triggerKey={triggerKey}
              soundEnabled={false}
              fill="#38bdf8"
              jumpingFill="#ffffff"
            />
          </g>
        </g>
      </svg>

      {/* Interactive hover indicator pill */}
      <AnimatePresence>
        {hoveredSegment && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#091b34]/95 border border-sky-400/40 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg pointer-events-none flex items-center gap-2 z-20 backdrop-blur-xs"
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{
                backgroundColor:
                  segments.find((s) => s.id === hoveredSegment)?.color || '#3b82f6',
              }}
            />
            <span className="font-bold">
              {segments.find((s) => s.id === hoveredSegment)?.label}:
            </span>
            <span>
              {segments.find((s) => s.id === hoveredSegment)?.percentage}% thị phần khách quốc tế
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
