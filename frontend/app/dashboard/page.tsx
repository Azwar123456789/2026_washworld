"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const queueLevels = ["low", "medium", "high"];

export default function DashboardPage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, queueRes] = await Promise.all([
          fetch("http://localhost:5001/api/locations"),
          fetch("http://localhost:5001/api/queue-status")
        ]);

        const locationsData = await locationsRes.json();
        const queueStatusData = await queueRes.json();

        setLocations(locationsData.locations.slice(0, 3));

        const formattedQueue = queueStatusData.queue_data.map((item, index) => ({
          name: item.location_city,
          text: item.que_status,
          level: queueLevels[index % queueLevels.length],
        }));

        setQueueData(formattedQueue);
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

            <button
              className="qr-button"
              onClick={() => router.push("/qr")}
            >
              Vis QR-kode
            </button>
          </div>
        </section>

        <section className="locations-section">
          <h3 className="section-title">Find din nærmeste vaskehal</h3>

          {!loading && locations.length > 0 ? (
            locations.map((location) => (
              <div key={location.location_pk} className="location-card">
                <img
                  src={`/${location.location_city.toLowerCase()}.webp`}
                  alt={location.location_city}
                  className="location-image"
                />

                <div className="location-info">
                  <h4>{location.location_city}</h4>
                  <p>{location.location_address}</p>

                  <div className="location-map-row">
                    <a href="#">Vis på kort</a>
                  </div>

                  <div className="location-queue-badge">
                    <div className="queue-badge-item">
                      <span className="queue-label">I kø</span>
                      <span className="queue-value">{location.in_que}</span>
                    </div>
                    <div className="queue-badge-item">
                      <span className="queue-label">Status</span>
                      <span className="queue-value">{location.que_status}</span>
                    </div>
                  </div>

                  <a href="#" className="location-more">
                    Læs mere
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>Loading locations...</p>
          )}

          <button className="show-more-button">Vis flere</button>
        </section>

        <section className="queue-section">
          <h3 className="section-title">Live kø status</h3>

          {!loading && queueData.length > 0 ? (
            queueData.map((item) => (
              <div key={item.name} className="queue-row">
                <div className="queue-name">{item.name}</div>
                <div className="queue-text">{item.text}</div>
                <div className="queue-bars">
                  <span className={`queue-bar ${item.level}`}></span>
                  <span className={`queue-bar ${item.level}`}></span>
                  <span className={`queue-bar ${item.level}`}></span>
                </div>
              </div>
            ))
          ) : (
            <p>Loading queue data...</p>
          )}
        </section>
      </div>
    </main>
  );
}
