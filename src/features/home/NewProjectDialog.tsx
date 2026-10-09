import { useState, type FormEvent } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SECTORS } from '@/lib/sectors';

export interface NewProjectValues {
  name: string;
  sector: string;
  municipality: string;
}

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: NewProjectValues) => Promise<void> | void;
}

export function NewProjectDialog({ open, onOpenChange, onCreate }: NewProjectDialogProps) {
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const nameError = touched && name.trim() === '' ? 'Escribe un nombre para el proyecto.' : undefined;

  function reset() {
    setName('');
    setSector('');
    setMunicipality('');
    setTouched(false);
    setBusy(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  async function submit(e?: FormEvent) {
    e?.preventDefault();
    setTouched(true);
    if (name.trim() === '' || busy) return;
    setBusy(true);
    try {
      await onCreate({ name: name.trim(), sector, municipality: municipality.trim() });
      reset();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Nuevo proyecto"
      description="Podrás completar el resto de los datos paso a paso."
      actions={
        <>
          <Button variant="text" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="filled" icon="add" onClick={() => submit()} disabled={busy}>
            Crear proyecto
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <TextField
          label="Nombre del proyecto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched(true)}
          errorText={nameError}
          autoFocus
          maxLength={150}
        />
        <Select
          label="Sector"
          value={sector || undefined}
          onChange={setSector}
          options={SECTORS.map((s) => ({ value: s, label: s }))}
          placeholder="Selecciona un sector"
        />
        <TextField
          label="Municipio"
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
          maxLength={80}
        />
        <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
      </form>
    </Dialog>
  );
}
