import type { Reporte } from '../../types/report';
import { Card } from '../ui/Card';
import { KpiCards } from './KpiCards';
import { SalesBarChart } from './SalesBarChart';
import { ParticipationDoughnut } from './ParticipationDoughnut';
import { ClientTable } from './ClientTable';
import styles from './DashboardPanel.module.css';

interface DashboardPanelProps {
  reporte: Reporte | null;
}

export function DashboardPanel({ reporte }: DashboardPanelProps) {
  if (!reporte) {
    return (
      <section className={styles.empty}>
        <p>
          Aún no hay datos. Ve a <b>Cargar facturas</b>, sube tus PDF y pulsa{' '}
          <b>Procesar facturas</b>.
        </p>
      </section>
    );
  }

  return (
    <div className={styles.dash}>
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.title}>
            Dashboard <span>de ventas</span>
          </h1>
          <p className={styles.sub}>Análisis de facturas · soluciones empresariales</p>
        </div>
        <KpiCards kpis={reporte.kpis} />
      </header>

      <main className={styles.grid}>
        <Card title="Ventas por servicio" hint="COP" className={styles.cardBar}>
          <div className={styles.chartWrap}>
            <SalesBarChart data={reporte.ventas_por_servicio} />
          </div>
        </Card>

        <Card title="Participación" hint="% ventas" className={styles.cardDough}>
          <div className={styles.chartWrap}>
            <ParticipationDoughnut data={reporte.ventas_por_servicio} />
          </div>
        </Card>

        <Card
          title="Resumen por cliente"
          hint={`${reporte.resumen_por_factura.length} clientes`}
          className={styles.cardTable}
        >
          <ClientTable rows={reporte.resumen_por_factura} />
        </Card>
      </main>
    </div>
  );
}
