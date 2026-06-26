import type { Kpis } from '../../types/report';
import { COP, NUM } from '../../lib/format';
import styles from './KpiCards.module.css';

interface KpiCardsProps {
  kpis: Kpis;
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const items = [
    { label: 'Ventas totales', value: COP.format(kpis.ventas_totales), accent: true },
    { label: 'Facturas', value: NUM.format(kpis.num_facturas) },
    { label: 'Unidades', value: NUM.format(kpis.unidades_vendidas) },
    { label: 'Ticket prom.', value: COP.format(kpis.ticket_promedio) },
    { label: 'Servicio top', value: kpis.servicio_top },
  ];

  return (
    <div className={styles.kpis}>
      {items.map((item) => (
        <div key={item.label} className={styles.kpi}>
          <div className={styles.label}>{item.label}</div>
          <div className={`${styles.value} ${item.accent ? styles.accent : ''}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
