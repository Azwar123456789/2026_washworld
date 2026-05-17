//NPM INSTALLATION
//apexcharts.com/docs/installation/

https: "use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";

const baseOptions = {
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
  xaxis: {
    categories: [
      "DEC",
      "NOV",
      "OCT",
      "SEPT",
      "AUG",
      "JUL",
      "JUN",
      "MAY",
      "APR",
      "MAR",
      "FEB",
      "JAN",
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
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [washData, setWashData] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWashData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:5001/api/wash-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.wash_data) {
          setWashData(data.wash_data);
        }
      } catch (error) {
        console.error("Failed to fetch wash data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWashData();
  }, []);

  useEffect(() => {
    if (!chartRef.current || loading) return;

    const options = {
      ...baseOptions,
      series: [{ name: "Washes", data: washData }],
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [washData, loading]);

  const totalLast12Months = washData.reduce((sum, value) => sum + value, 0);
  const last30Days = washData[washData.length - 1];

  return (
    <section className="activity-content">
      <h2 className="section-title">Aktivitet</h2>
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

      <button
        className="show-more-button"
        onClick={() => router.push("/activity/Activitylog")}
      >
        Vis mere
      </button>
    </section>
  );
}
