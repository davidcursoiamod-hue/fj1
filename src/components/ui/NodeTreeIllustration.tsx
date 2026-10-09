import { motion, useReducedMotion } from 'framer-motion';

interface NodeTreeIllustrationProps {
  size?: number;
  className?: string;
}

export function NodeTreeIllustration({ size = 200, className }: NodeTreeIllustrationProps) {
  const reduced = useReducedMotion();
  const nodes = [
    { cx: 100, cy: 30, r: 12 },
    { cx: 50, cy: 100, r: 10 },
    { cx: 150, cy: 100, r: 10 },
    { cx: 30, cy: 160, r: 8 },
    { cx: 75, cy: 160, r: 8 },
    { cx: 125, cy: 160, r: 8 },
    { cx: 170, cy: 160, r: 8 },
  ];
  const edges = [
    { d: 'M100 42 L50 90', len: 60 },
    { d: 'M100 42 L150 90', len: 60 },
    { d: 'M50 110 L30 152', len: 50 },
    { d: 'M50 110 L75 152', len: 50 },
    { d: 'M150 110 L125 152', len: 50 },
    { d: 'M150 110 L170 152', len: 50 },
  ];

  return (
    <svg
      width={size}
      height={size * 0.9}
      viewBox="0 0 200 180"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {edges.map((e, i) => (
        <motion.path
          key={i}
          d={e.d}
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={
            reduced
              ? { duration: 0.12, delay: i * 0.05 }
              : { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
          }
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={n.r}
          fill="var(--primary)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            reduced
              ? { duration: 0.12, delay: 0.3 + i * 0.05 }
              : { type: 'spring', stiffness: 380, damping: 28, delay: 0.3 + i * 0.08 }
          }
          style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
        />
      ))}
    </svg>
  );
}
