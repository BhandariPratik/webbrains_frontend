"use client";
import React, { useState, useEffect } from "react";
import withAuth from "@/components/withAuth";
import { useempGraph } from "@/redux/api/department";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const generateRandomColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const backgroundColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`;
    const borderColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
    colors.push({ backgroundColor, borderColor });
  }
  return colors;
};

const Dashboard = () => {
  const { data, error, isLoading } = useempGraph();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: [],
    }],
  });

  useEffect(() => {
    if (data?.data) {
      const colors = generateRandomColors(data.data.length);

      setChartData({
        labels: data.data.map(dept => dept.department),
        datasets: [{
          data: data.data.map(dept => dept.totalEmp),
          backgroundColor: colors.map(color => color.backgroundColor),
          borderColor: colors.map(color => color.borderColor),
          borderWidth: 1,
        }]
      });
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center pt-5">
      <h4 className="text-center">Graph for Employees/Department</h4>
      <div className="h-96 w-96">
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
