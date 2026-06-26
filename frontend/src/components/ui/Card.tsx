import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  hint?: ReactNode;
  /** Clase extra para ajustar el ancho/posición en la grilla. */
  className?: string;
  children: ReactNode;
}

/** Tarjeta con cabecera (título + pista) usada en el dashboard. */
export function Card({ title, hint, className, children }: CardProps) {
  return (
    <section className={`${styles.card} ${className ?? ''}`}>
      <div className={styles.head}>
        <h2>{title}</h2>
        {hint != null && <span className={styles.hint}>{hint}</span>}
      </div>
      {children}
    </section>
  );
}
