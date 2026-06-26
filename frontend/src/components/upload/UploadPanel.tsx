import { useState } from 'react';
import { Button } from '../ui/Button';
import { procesarFacturas } from '../../lib/api';
import type { Reporte } from '../../types/report';
import { Dropzone } from './Dropzone';
import { FileList } from './FileList';
import { usePdfFiles } from './usePdfFiles';
import styles from './UploadPanel.module.css';

interface UploadPanelProps {
  /** Se invoca con el reporte recién calculado al procesar correctamente. */
  onProcessed: (reporte: Reporte) => void;
}

export function UploadPanel({ onProcessed }: UploadPanelProps) {
  const { files, add, removeAt, clear } = usePdfFiles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleProcess() {
    setLoading(true);
    setError('');
    try {
      const { reporte } = await procesarFacturas(files);
      clear();
      onProcessed(reporte);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.panel}>
      <header className={styles.head}>
        <h2>Cargar facturas</h2>
        <p>Sube las facturas en PDF para analizarlas.</p>
      </header>

      <Dropzone onFiles={add} />
      <FileList files={files} onRemove={removeAt} />

      {error && (
        <p className={styles.error}>
          {error}
          <br />
          <small>¿Está corriendo el backend? uvicorn api:app --port 8000</small>
        </p>
      )}

      <div className={styles.actions}>
        <span className={styles.count}>
          {files.length ? `${files.length} archivo(s)` : ''}
        </span>
        <Button onClick={handleProcess} disabled={files.length === 0 || loading}>
          {loading ? 'Procesando…' : 'Procesar facturas'}
        </Button>
      </div>
    </section>
  );
}
