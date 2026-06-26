import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import type { VentaPorServicio } from '../../types/report';
import { COP } from '../../lib/format';
import { colorAt } from '../../lib/palette';

interface SalesBarChartProps {
  data: VentaPorServicio[];
}

/** Ventas totales por servicio (barras horizontales). */
export function SalesBarChart({ data }: SalesBarChartProps) {
  const chartData = useMemo<ChartData<'bar'>>(
    () => ({
      labels: data.map((d) => d.servicio),
      datasets: [
        {
          data: data.map((d) => d.ventas_total),
          backgroundColor: data.map((_, i) => colorAt(i) + 'cc'),
          borderColor: data.map((_, i) => colorAt(i)),
          borderWidth: 1,
          borderRadius: 6,
          maxBarThickness: 46,
        },
      ],
    }),
    [data],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => COP.format(c.raw as number) } },
      },
      scales: {
        x: {
          grid: { color: '#1f2540' },
          ticks: { callback: (v) => '$' + (v as number) / 1e6 + 'M' },
        },
        y: { grid: { display: false } },
      },
    }),
    [],
  );

  return <Bar data={chartData} options={options} />;
}
