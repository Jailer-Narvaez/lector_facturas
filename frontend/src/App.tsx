import { useEffect, useRef, useState } from 'react';
import './lib/chartSetup';
import { useAuth } from './hooks/useAuth';
import { LoginScreen } from './components/auth/LoginScreen';
import { Shell } from './components/layout/Shell';
import type { PanelId } from './components/layout/navigation';
import { UploadPanel } from './components/upload/UploadPanel';
import { DashboardPanel } from './components/dashboard/DashboardPanel';
import { cargarUltimoReporte } from './lib/api';
import type { Reporte } from './types/report';

export function App() {
  const { user, login, logout } = useAuth();
  const [panel, setPanel] = useState<PanelId>('upload');
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const intentoCargaPrevia = useRef(false);

  // Al abrir el dashboard por primera vez sin datos en memoria, intenta
  // cargar el último análisis guardado (output/analisis.json). Silencioso:
  // si no existe, el panel muestra su estado vacío.
  useEffect(() => {
    if (panel !== 'dashboard' || reporte || intentoCargaPrevia.current) return;
    intentoCargaPrevia.current = true;
    cargarUltimoReporte()
      .then(setReporte)
      .catch(() => undefined);
  }, [panel, reporte]);

  function handleLogout() {
    logout();
    setPanel('upload');
    setReporte(null);
    intentoCargaPrevia.current = false;
  }

  function handleProcessed(nuevo: Reporte) {
    setReporte(nuevo);
    setPanel('dashboard');
  }

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <Shell active={panel} user={user} onNavigate={setPanel} onLogout={handleLogout}>
      {panel === 'upload' ? (
        <UploadPanel onProcessed={handleProcessed} />
      ) : (
        <DashboardPanel reporte={reporte} />
      )}
    </Shell>
  );
}
