import { formatBytes } from '../../lib/format';
import styles from './FileList.module.css';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

/** Lista de archivos seleccionados con opción de quitar cada uno. */
export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <ul className={styles.list}>
      {files.map((f, i) => (
        <li key={`${f.name}-${f.size}`} className={styles.item}>
          <span className={styles.ico}>PDF</span>
          <span className={styles.name}>{f.name}</span>
          <span className={styles.size}>{formatBytes(f.size)}</span>
          <button
            type="button"
            className={styles.del}
            title="Quitar"
            onClick={() => onRemove(i)}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
