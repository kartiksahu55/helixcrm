import {
  ArcElement,
  Chart as ChartJS,
  Colors,
  Legend,
  Tooltip,
} from "chart.js/auto";
import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";

import { month } from "../../StaticData/StaticData";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

const BarChart = ({ chartData }) => {
console.log("chartData: ", chartData);
  const cfg = {
    labels: chartData.data.map((e) => e.month),
    datasets: [
      {
        id: 1,
        label: chartData.legend,
        data: chartData.data.map((e) => e.sales),
        
      },
    ],
  };
  return (
    <Bar
      className="sm:h-64 md:h-72 lg:h-80 shadow-lg p-2 rounded-md" 
      datasetIdKey="id"
      data={cfg}
      
    />
  );
};

export default BarChart;
