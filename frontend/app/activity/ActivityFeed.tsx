//NPM INSTALLATION
//apexcharts.com/docs/installation/

https: "use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const washData = [12, 5, 27, 10, 2, 6, 8, 11, 23, 13, 6, 24];

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
      data: washData,
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
  const totalLast12Months = washData.reduce((sum, value) => sum + value, 0);
  const last30Days = washData[washData.length - 1];

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
      <h2 className="section-title">
        <Link href="/activity/Activitylog" className="activity-log-link">
          Aktivitet 🡲
        </Link>
      </h2>
      <div ref={chartRef} id="activity-chart"></div>

      <div className="stats-section">
        <div className="stats-header">
          <h3>Statistik</h3>
        </div>
        <div className="stats-cards">
          <div className="stats-card">
            <div className="stats-card-value">{totalLast12Months} vask</div>
            <div className="stats-card-text">Sidste 12 måneder</div>
          </div>
          <div className="stats-card">
            <div className="stats-card-value">{last30Days} vask</div>
            <div className="stats-card-text">Sidste 30 dage</div>
          </div>
        </div>
      </div>
    </section>
  );
}
