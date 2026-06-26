import { useCallback, useState } from 'react';

const isPdf = (f: File): boolean =>
  f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');

/**
 * Colección de archivos PDF seleccionados: filtra no-PDF y evita duplicados
 * (mismo nombre y tamaño).
 */
export function usePdfFiles() {
  const [files, setFiles] = useState<File[]>([]);

  const add = useCallback((incoming: FileList | File[]) => {
    setFiles((prev) => {
      const next = [...prev];
      for (const f of Array.from(incoming)) {
        if (!isPdf(f)) continue;
        if (!next.some((a) => a.name === f.name && a.size === f.size)) next.push(f);
      }
      return next;
    });
  }, []);

  const removeAt = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => setFiles([]), []);

  return { files, add, removeAt, clear };
}
