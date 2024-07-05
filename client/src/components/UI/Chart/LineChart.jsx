import { Line } from "react-chartjs-2";

const LineChart = ({ chartData }) => {
  return (
    <Line
      className="rounded-md p-2 shadow-lg sm:h-52 md:h-full lg:h-72"
      data={chartData}
    ></Line>
  );
};

export default LineChart;
