import { Button } from '../ui/Button';
import { NAV_ENTRIES, type PanelId } from './navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
  active: PanelId;
  user: string;
  onNavigate: (panel: PanelId) => void;
  onLogout: () => void;
}

export function Sidebar({ active, user, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src="/img/logo.png" alt="Davrant" className={styles.logo} />
      </div>

      <nav className={styles.nav}>
        {NAV_ENTRIES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`${styles.item} ${active === entry.id ? styles.active : ''}`}
            onClick={() => onNavigate(entry.id)}
          >
            <span className={styles.ico}>{entry.icon}</span> {entry.label}
          </button>
        ))}
      </nav>

      <div className={styles.foot}>
        <span className={styles.user}>{user}</span>
        <Button variant="ghost" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
