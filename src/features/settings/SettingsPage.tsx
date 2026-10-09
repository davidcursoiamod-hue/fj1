import { useEffect, useRef, useState } from 'react';
import { APP_NAME, APP_VERSION, AUTHOR } from '@/config';
import { Card, CardHeader } from '@/components/ui/Card';
import { SegmentedButton } from '@/components/ui/SegmentedButton';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { showSnackbar } from '@/components/ui/snackbarStore';
import { useThemeStore } from '@/store/themeStore';
import { useProjectStore } from '@/store/projectStore';
import { downloadTextFile, todayStamp } from '@/lib/download';
import { describeImportResult } from '@/lib/importMessage';
import {
  DEFAULT_DISCOUNT_RATE_PCT,
  getDefaultDiscountRatePct,
  isValidRatePct,
  setDefaultDiscountRatePct,
} from '@/lib/settings';

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1).replace('.', ',')} KB`;
  return `${(n / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}

function useStorageUsage(refreshKey: number): number | null {
  const [usage, setUsage] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    const est = typeof navigator !== 'undefined' ? navigator.storage?.estimate : undefined;
    if (!est) return;
    navigator.storage
      .estimate()
      .then((e) => {
        if (alive && typeof e.usage === 'number') setUsage(e.usage);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [refreshKey]);
  return usage;
}

export function SettingsPage() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const projects = useProjectStore((s) => s.projects);
  const loadList = useProjectStore((s) => s.loadList);
  const exportAll = useProjectStore((s) => s.exportAll);
  const importFile = useProjectStore((s) => s.importFile);
  const deleteAll = useProjectStore((s) => s.deleteAll);

  const fileRef = useRef<HTMLInputElement>(null);
  const [rateText, setRateText] = useState(() => String(getDefaultDiscountRatePct()).replace('.', ','));
  const [rateSaved, setRateSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [usageKey, setUsageKey] = useState(0);
  const usage = useStorageUsage(usageKey);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const parsedRate = Number(rateText.replace(',', '.'));
  const rateValid = rateText.trim() !== '' && isValidRatePct(parsedRate);

  function saveRate() {
    if (!rateValid) return;
    setDefaultDiscountRatePct(parsedRate);
    setRateSaved(true);
    showSnackbar('Tasa de descuento guardada. Se aplicará a los proyectos nuevos.', 'success');
  }

  function resetRate() {
    setDefaultDiscountRatePct(DEFAULT_DISCOUNT_RATE_PCT);
    setRateText(String(DEFAULT_DISCOUNT_RATE_PCT));
    setRateSaved(true);
  }

  async function handleExport() {
    const json = await exportAll();
    downloadTextFile(`formula-proyectos-${todayStamp()}.json`, json);
    showSnackbar('Copia de seguridad descargada.', 'success');
  }

  async function handleImport(file: File | undefined) {
    if (!file) return;
    const result = describeImportResult(await importFile(await file.text()));
    showSnackbar(result.message, result.variant);
    if (fileRef.current) fileRef.current.value = '';
    setUsageKey((k) => k + 1);
  }

  async function handleDeleteAll() {
    await deleteAll();
    setConfirmOpen(false);
    setConfirmText('');
    setUsageKey((k) => k + 1);
    showSnackbar('Todos los datos fueron borrados de este navegador.', 'default');
  }

  const count = projects.length;

  return (
    <div className="max-w-content mx-auto w-full px-4 py-6 md:py-8">
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        aria-label="Importar proyectos desde un archivo .json"
        onChange={(e) => void handleImport(e.target.files?.[0])}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-on-surface mb-1">Ajustes</h1>
        <p className="text-sm text-on-surface-variant">
          Personaliza la apariencia y el comportamiento de {APP_NAME}.
        </p>
      </header>

      <div className="space-y-4">
        <Card variant="outlined">
          <CardHeader title="Apariencia" subtitle="Elige cómo se ve la aplicación" icon="palette" />
          <label className="text-sm font-medium text-on-surface mb-2 block">Tema</label>
          <SegmentedButton
            value={mode}
            onChange={(v) => setMode(v as 'light' | 'dark' | 'system')}
            options={[
              { value: 'light', label: 'Claro', icon: 'light_mode' },
              { value: 'dark', label: 'Oscuro', icon: 'dark_mode' },
              { value: 'system', label: 'Sistema', icon: 'auto_awesome' },
            ]}
          />
        </Card>

        <Card variant="outlined">
          <CardHeader
            title="Tasa de descuento por defecto"
            subtitle="Se usa al crear proyectos nuevos"
            icon="percent"
          />
          <div className="flex flex-wrap items-start gap-3">
            <div className="w-40">
              <TextField
                label="Tasa (%)"
                inputMode="decimal"
                value={rateText}
                onChange={(e) => {
                  setRateText(e.target.value);
                  setRateSaved(false);
                }}
                errorText={rateValid || rateText === '' ? undefined : 'Debe estar entre 0 y 100'}
              />
            </div>
            <Button variant="tonal" icon="check" onClick={saveRate} disabled={!rateValid || rateSaved}>
              Guardar
            </Button>
            <Button variant="text" onClick={resetRate}>
              Restablecer ({DEFAULT_DISCOUNT_RATE_PCT} %)
            </Button>
          </div>
          <p className="text-xs text-on-surface-variant mt-3">
            Valor editable de referencia. Confírmalo con tu profesor antes de usarlo en un trabajo formal.
            Cada proyecto conserva su propia tasa, que puedes cambiar en el módulo de evaluación.
          </p>
        </Card>

        <Card variant="outlined">
          <CardHeader
            title="Tus datos"
            subtitle="Todo se guarda solo en este navegador"
            icon="storage"
          />
          <dl className="space-y-2.5 text-sm mb-4">
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Proyectos guardados</dt>
              <dd className="text-on-surface font-medium tabular-nums">{count}</dd>
            </div>
            {usage !== null && (
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Espacio usado (aprox.)</dt>
                <dd className="text-on-surface font-medium tabular-nums">{formatBytes(usage)}</dd>
              </div>
            )}
          </dl>
          <div className="flex flex-wrap gap-2">
            <Button variant="tonal" icon="download" onClick={() => void handleExport()} disabled={count === 0}>
              Exportar todos (.json)
            </Button>
            <Button variant="outlined" icon="upload_file" onClick={() => fileRef.current?.click()}>
              Importar proyectos
            </Button>
          </div>
          <p className="text-xs text-on-surface-variant mt-3">
            Si borras los datos del navegador, tus proyectos se pierden. Descarga una copia con frecuencia.
          </p>
        </Card>

        <Card variant="filled">
          <CardHeader title="Zona de riesgo" subtitle="Acciones que no se pueden deshacer" icon="warning" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="max-w-md">
              <p className="text-sm font-medium text-on-surface">Borrar todos los datos</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Elimina permanentemente todos los proyectos guardados en este navegador.
              </p>
            </div>
            <Button
              variant="outlined"
              icon="delete_forever"
              className="!text-error !border-error"
              disabled={count === 0}
              onClick={() => setConfirmOpen(true)}
            >
              Borrar todo
            </Button>
          </div>
        </Card>

        <Card variant="outlined">
          <CardHeader title="Acerca de" subtitle="Información de la aplicación" icon="info" />
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Versión</dt>
              <dd className="text-on-surface font-medium tabular-nums">{APP_VERSION}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Autor</dt>
              <dd className="text-on-surface font-medium">{AUTHOR}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <footer className="mt-8 pt-4 border-t border-outline-variant/30 text-center">
        <p className="text-xs text-on-surface-variant leading-relaxed">Creado por {AUTHOR}</p>
        <p className="text-xs text-on-surface-variant/70 mt-1 leading-relaxed max-w-md mx-auto">
          Herramienta educativa basada en la metodología MGA del DNP. No es el aplicativo oficial.
        </p>
      </footer>

      <Dialog
        open={confirmOpen}
        onOpenChange={(o) => {
          setConfirmOpen(o);
          if (!o) setConfirmText('');
        }}
        title="¿Borrar todos los datos?"
        description={`Se eliminarán ${count} ${count === 1 ? 'proyecto' : 'proyectos'} de este navegador. Esta acción no se puede deshacer.`}
        actions={
          <>
            <Button variant="text" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="filled"
              className="!bg-error !text-on-error"
              disabled={confirmText.trim().toUpperCase() !== 'BORRAR'}
              onClick={() => void handleDeleteAll()}
            >
              Borrar todo
            </Button>
          </>
        }
      >
        <TextField
          label='Escribe "BORRAR" para confirmar'
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          autoComplete="off"
        />
      </Dialog>
    </div>
  );
}
