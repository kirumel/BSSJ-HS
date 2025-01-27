"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  indexAxis: "y" as const, // 타입을 명시적으로 지정
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      max: 100, // x축의 최대값을 100으로 설정
      grid: {
        display: false, // x축의 그리드를 제거
      },
    },
    y: {
      grid: {
        display: false, // y축의 그리드를 제거
      },
    },
  },
};

const LineChart = () => {
  const data = {
    labels: ["1학기 중간", "1학기 기말", "2학기 중간", "2학기 기말"],
    datasets: [
      {
        fill: true,
        label: "",
        backgroundColor: "rgba(138, 156, 255)", // 가시성을 위해 투명도를 조정했습니다
        borderColor: "#8a9bff",
        borderRadius: 10, // 양쪽 모두 둥글게 설정
        data: [89, 88, 65, 73],
      },
    ],
  };

  return <Bar data={data} options={options} />;
};

export default LineChart;
