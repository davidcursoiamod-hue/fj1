import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { IconButton } from '@/components/ui/IconButton';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

interface ProjectMenuProps {
  projectName: string;
  onOpen: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export function ProjectMenu({ projectName, onOpen, onDuplicate, onExport, onDelete }: ProjectMenuProps) {
  const [open, setOpen] = useState(false);

  const items = [
    { icon: 'open_in_new', label: 'Abrir', onSelect: onOpen, danger: false },
    { icon: 'content_copy', label: 'Duplicar', onSelect: onDuplicate, danger: false },
    { icon: 'download', label: 'Exportar (.json)', onSelect: onExport, danger: false },
    { icon: 'delete', label: 'Eliminar', onSelect: onDelete, danger: true },
  ];

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <IconButton icon="more_vert" label={`Más acciones de ${projectName}`} size="sm" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-[190px] rounded-md bg-surface-high p-1.5 shadow-float outline-none"
        >
          <ul role="menu">
            {items.map((item) => (
              <li key={item.label} role="none">
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    item.onSelect();
                  }}
                  className={cn(
                    'state-layer flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-medium',
                    item.danger ? 'text-error' : 'text-on-surface',
                  )}
                >
                  <Icon name={item.icon} size={20} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
