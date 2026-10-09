import { type ReactNode } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: { value: string; label: string; icon?: string }[];
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, tabs, children, className }: TabsProps) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange} className={cn('w-full', className)}>
      <TabsPrimitive.List
        className="flex gap-1 border-b border-outline-variant overflow-x-auto"
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'state-layer relative inline-flex items-center gap-1.5 px-4 h-11 text-sm font-medium whitespace-nowrap',
              'transition-colors duration-150 select-none',
              'data-[state=active]:text-primary data-[state=inactive]:text-on-surface-variant',
              'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-t-sm',
              'data-[state=active]:after:bg-primary data-[state=inactive]:after:bg-transparent',
              'after:transition-colors after:duration-200',
            )}
          >
            {tab.icon && <Icon name={tab.icon} size={20} />}
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      <TabsPrimitive.Content value={value} className="pt-4 focus-visible:outline-none">
        {children}
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  );
}
