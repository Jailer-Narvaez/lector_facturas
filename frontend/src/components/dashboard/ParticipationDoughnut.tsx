import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import type { VentaPorServicio } from '../../types/report';
import { colorAt } from '../../lib/palette';

interface ParticipationDoughnutProps {
  data: VentaPorServicio[];
}

/** Participación de cada servicio sobre el total de ventas (doughnut). */
export function ParticipationDoughnut({ data }: ParticipationDoughnutProps) {
  const chartData = useMemo<ChartData<'doughnut'>>(
    () => ({
      labels: data.map((d) => d.servicio),
      datasets: [
        {
          data: data.map((d) => d.ventas_total),
          backgroundColor: data.map((_, i) => colorAt(i)),
          borderColor: '#0d111c',
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    }),
    [data],
  );

  const options = useMemo<ChartOptions<'doughnut'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, boxHeight: 10, padding: 10, usePointStyle: true },
        },
        tooltip: {
          callbacks: {
            label: (c) =>
              `${c.label}: ${(c.parsed as number).toLocaleString('es-CO')} (${
                data[c.dataIndex].pct_ventas
              }%)`,
          },
        },
      },
    }),
    [data],
  );

  return <Doughnut data={chartData} options={options} />;
}
