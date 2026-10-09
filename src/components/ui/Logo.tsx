import { cn } from '@/lib/cn';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 36, className, showText = true }: LogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        className="shrink-0"
        aria-hidden="true"
      >
        <circle cx="18" cy="18" r="18" fill="var(--primary-container)" />
        {/* Top node */}
        <circle cx="18" cy="10" r="3.5" fill="var(--primary)" />
        {/* Bottom-left node */}
        <circle cx="11" cy="26" r="3" fill="var(--primary)" />
        {/* Bottom-right node */}
        <circle cx="25" cy="26" r="3" fill="var(--primary)" />
        {/* Connecting lines */}
        <path
          d="M18 13.5 L11 23 M18 13.5 L25 23"
          stroke="var(--primary)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span
          className="font-semibold text-on-surface tracking-tight"
          style={{ fontVariationSettings: "'wdth' 120, 'wght' 700", fontSize: size * 0.5 }}
        >
          Formula
        </span>
      )}
    </div>
  );
}
