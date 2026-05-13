"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LocationsSection from "./locations_section";

const queueLevels = ["low", "medium", "high"];

const getStatusLabel = (status) => {
  const statusNum = parseInt(status);
  if (statusNum <= 3) return "Easy";
  if (statusNum <= 7) return "Normal";
  return "Busy";
};

export default function DashboardPage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsRes = await fetch("http://localhost:5001/api/locations");
        const locationsData = await locationsRes.json();
        setLocations(locationsData.locations.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div className="dashboard-hero-top">
            <img
              src="/logo_sort.webp"
              alt="Wash World"
              className="dashboard-logo"
            />
          </div>

          <h2 className="dashboard-greeting">Hej, Jonas</h2>
          <p className="dashboard-subtitle">Klar til din næste vask?</p>
        </section>

        <section className="qr-section">
          <div className="qr-image-box">
            <img src="/qr-placeholder.png" alt="QR kode" className="qr-image" />
          </div>

          <div className="qr-text-box">
            <h3>Start vask</h3>
            <p>Scan QR-koden på maskinen for at starte vask</p>

            <button className="qr-button" onClick={() => router.push("/qr")}>
              Vis QR-kode
            </button>
          </div>
        </section>

        <LocationsSection locations={locations} loading={loading} />
      </div>
    </main>
  );
}
