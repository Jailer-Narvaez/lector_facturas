import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import type { PanelId } from './navigation';
import styles from './Shell.module.css';

interface ShellProps {
  active: PanelId;
  user: string;
  onNavigate: (panel: PanelId) => void;
  onLogout: () => void;
  children: ReactNode;
}

/** Estructura general autenticada: barra lateral + contenido del panel activo. */
export function Shell({ active, user, onNavigate, onLogout, children }: ShellProps) {
  return (
    <div className={styles.shell}>
      <Sidebar active={active} user={user} onNavigate={onNavigate} onLogout={onLogout} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
