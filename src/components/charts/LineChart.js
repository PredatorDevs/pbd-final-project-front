import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart(props) {
  const {
    legendText,
    chartLabels,
    chartDataset
  } = props;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: legendText || 'Mi gráfica',
      },
    },
  };

  const labels = chartLabels || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 14, 25, 26, 27, 28, 29, 30, 31];

  const data = {
    labels,
    datasets: chartDataset || [],
  };

  return (
    <Line
      options={options}
      data={data}
    />
  );
}

export default LineChart;
