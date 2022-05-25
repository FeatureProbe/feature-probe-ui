import { ChartOptions } from 'chart.js';
import { externalTooltipHandler } from "./chartTooltip";

export const createChartOptions = (): ChartOptions<'line'> => {
  return {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
      },
    },
    scales: {
      x: {
        offset: true,
        grid: {
          display: false,
        }
      },
      y: {
        offset: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.07)',
          borderDash: [5],
          drawBorder: false,
        },
      },
    },
  };
};
  