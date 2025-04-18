import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ResultData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ResultsProps {
  data: ResultData;
}

const Results: React.FC<ResultsProps> = ({ data }) => {
  const chartData = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Salary Trends',
        data: data?.salaryTrend || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <Box mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Analysis Results
          </Typography>
          <Typography variant="body1" paragraph>
            {data?.analysis}
          </Typography>
          <Box height={400}>
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Results;