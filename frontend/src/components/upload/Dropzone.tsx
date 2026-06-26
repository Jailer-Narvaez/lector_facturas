import { useRef, useState, type DragEvent } from 'react';
import styles from './Dropzone.module.css';

interface DropzoneProps {
  onFiles: (files: FileList) => void;
}

/** Zona de arrastrar-y-soltar (o clic) para seleccionar PDFs. */
export function Dropzone({ onFiles }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  }

  return (
    <div
      className={`${styles.dropzone} ${over ? styles.over : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setOver(false);
      }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <div className={styles.inner}>
        <span className={styles.icon}>⬆</span>
        <p>
          Arrastra tus PDF aquí o <span className={styles.link}>selecciónalos</span>
        </p>
        <small>Solo archivos .pdf</small>
      </div>
    </div>
  );
}
