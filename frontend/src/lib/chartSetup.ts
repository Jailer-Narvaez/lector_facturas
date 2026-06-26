// Registro central de Chart.js: importar este módulo una vez activa los
// elementos usados por los gráficos y aplica los estilos por defecto Davrant.
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

Chart.defaults.color = '#7a83a8';
Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
Chart.defaults.font.size = 11;
