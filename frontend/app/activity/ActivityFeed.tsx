"use client";

import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const options = {
  chart: {
    type: "bar",
    height: 600,
    toolbar: {
      show: false,
    },
    events: {
      dataPointSelection(event, chartContext, config) {
        const month = config.w.config.xaxis.categories[config.dataPointIndex];
        const value = config.w.config.series[0].data[config.dataPointIndex];

        alert(`Statistics for ${month}: ${value} washes`);
      },
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "70%",
      columnWidth: "200%",
      SPACEBETWEEN: 50,
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ["#505050"],
    },
  },
  colors: ["#42BC69"],
  series: [
    {
      name: "Washes",
      data: [30, 40, 45, 50, 49, 60, 70, 91, 125, 100, 110, 112],
    },
  ],
  xaxis: {
    categories: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEPT",
      "OCT",
      "NOV",
      "DEC",
    ],
    labels: {
      style: {
        fontSize: "14px",
        fontWeight: 900,
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontWeight: 900,
      },
    },
  },
};

export default function ActivityFeed() {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <section className="activity-content">
      <h2 className="section-title">Aktivitetslog</h2>
      <div ref={chartRef} id="activity-chart"></div>
    </section>
  );
}
