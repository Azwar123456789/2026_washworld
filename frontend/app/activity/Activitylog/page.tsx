"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ActivityLogPage() {
  const [recentWashes, setRecentWashes] = useState([]);
  const [totalWashPrice, setTotalWashPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/activity-log");
        const data = await response.json();

        if (data.activity_log) {
          const formattedWashes = data.activity_log.map((wash) => {
            const date = new Date(wash.washed_at * 1000);
            return {
              title: wash.wash_type,
              location: wash.location_city,
              price: `${wash.subscription_price} kr.`,
              date: date.toLocaleDateString("da-DK", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          });
          setRecentWashes(formattedWashes);

          const total = data.activity_log.reduce(
            (sum, wash) => sum + wash.subscription_price,
            0,
          );
          setTotalWashPrice(total);
        }
      } catch (error) {
        console.error("Error fetching activity log:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLog();
  }, []);

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <h1 className="dashboard-top-title">Aktiviteter</h1>

        <section className="auth-header">
          <img src="/logo_sort.webp" alt="Wash World" className="auth-logo" />
        </section>

        <section className="activity-section">
          <h1 className="section-title">
            <Link href="/activity" className="activity-log-link">
              ← Seneste vaske
            </Link>
          </h1>

          <div className="activity-list">
            {recentWashes.map((wash) => (
              <article key={wash.date} className="activity-card">
                <div className="activity-card-icon">🚗</div>
                <div className="activity-card-content">
                  <div className="activity-card-top">
                    <div>
                      <p className="activity-card-title">{wash.title}</p>
                      <p className="activity-card-location">{wash.location}</p>
                    </div>
                    <span className="activity-card-price">{wash.price}</span>
                  </div>
                  <p className="activity-card-date">{wash.date}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="activity-section">
          <p className="activity-subtitle">Dine besparelser</p>

          <div className="savings-grid">
            <div className="saving-card">
              <div className="saving-card-icon">💳</div>
              <div>
                <p className="saving-card-title">Du har betalt</p>
                <p className="saving-card-value">{totalWashPrice} kr</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
