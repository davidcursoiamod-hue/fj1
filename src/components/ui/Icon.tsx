import { cn } from '@/lib/cn';

interface IconProps {
  name: string;
  size?: number;
  fill?: boolean;
  className?: string;
  'aria-hidden'?: boolean;
}

export function Icon({ name, size = 24, fill = false, className, ...rest }: IconProps) {
  return (
    <span
      className={cn('material-symbols-rounded', fill && 'fill', className)}
      style={{ fontSize: size, width: size, height: size }}
      aria-hidden={rest['aria-hidden'] ?? true}
      role={rest['aria-hidden'] === false ? 'img' : undefined}
    >
      {name}
    </span>
  );
}
