import type { ResumenPorFactura } from '../../types/report';
import { COP } from '../../lib/format';
import styles from './ClientTable.module.css';

interface ClientTableProps {
  rows: ResumenPorFactura[];
}

/** Resumen agregado por cliente / factura. */
export function ClientTable({ rows }: ClientTableProps) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th className={styles.num}>Servicios</th>
            <th className={styles.num}>Unidades</th>
            <th className={styles.num}>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.factura}>
              <td>{r.cliente}</td>
              <td className={styles.num}>{r.num_servicios}</td>
              <td className={styles.num}>{r.unidades}</td>
              <td className={`${styles.num} ${styles.total}`}>
                {COP.format(r.total_factura)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
