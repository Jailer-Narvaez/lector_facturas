// Definición de los módulos navegables del panel.
export type PanelId = 'upload' | 'dashboard';

export interface NavEntry {
  id: PanelId;
  label: string;
  icon: string;
}

export const NAV_ENTRIES: NavEntry[] = [
  { id: 'upload', label: 'Cargar facturas', icon: '⬆' },
  { id: 'dashboard', label: 'Dashboard', icon: '▣' },
];
