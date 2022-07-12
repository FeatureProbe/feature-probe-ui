import { ChartOptions } from 'chart.js';
import { externalTooltipHandler } from "./chartTooltip";
import { IMetric } from 'interfaces/targeting';

// export const createChartOptions = (metric: IMetric[]): ChartOptions<'line'> => {
export const createChartOptions = (metric: IMetric[], projectKey: string, environmentKey: string, toggleKey: string): any => {
  const config = {
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
      annotation: {
        annotations: {}
      }
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

  metric.forEach((item: IMetric, index: number) => {
    if (item.lastChangeVersion !== undefined) {
      const key = 'line' + index;
      // @ts-ignore
      config.plugins.annotation.annotations[key] = {
        type: 'line',
        xMin: index,
        xMax: index,
        borderColor: '#F5483B',
        borderWidth: 2,
        click: () => {
          window.open(`/${projectKey}/${environmentKey}/${toggleKey}/targeting?currentVersion=${item.lastChangeVersion}`)
        },
        label: {
          enabled: true,
          backgroundColor: '#F5483B',
          content: () => '版本变更',
          position: 'start',
          xAdjust: 29,
          yAdjust: -8,
          borderRadius: {
            topLeft: 0,
            topRight: 4,
            bottomLeft: 0,
            bottomRight: 4,
          }
        }
      }
    }
  })
  return config;
};
  