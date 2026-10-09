import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface ProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  colorVar?: string;
  trackColorVar?: string;
  showLabel?: boolean;
  className?: string;
  pulseOnComplete?: boolean;
}

export function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
  colorVar = 'var(--primary)',
  trackColorVar = 'var(--outline-variant)',
  showLabel = false,
  className,
  pulseOnComplete = false,
}: ProgressRingProps) {
  const reduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const offset = circumference - clampedProgress * circumference;
  const isComplete = clampedProgress >= 1;

  return (
    <motion.div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      animate={
        isComplete && pulseOnComplete && !reduced
          ? { scale: [1, 1.08, 1] }
          : undefined
      }
      transition={
        isComplete && pulseOnComplete && !reduced
          ? { duration: 0.5, times: [0, 0.5, 1] }
          : undefined
      }
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColorVar}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorVar}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 120, damping: 20 }}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-medium text-on-surface tabular-nums">
          {Math.round(clampedProgress * 100)}%
        </span>
      )}
    </motion.div>
  );
}
