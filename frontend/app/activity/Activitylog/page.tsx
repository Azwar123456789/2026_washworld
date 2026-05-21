"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ActivityLogPage() {
  const router = useRouter();
  const [recentWashes, setRecentWashes] = useState([]);
  const [totalWashPrice, setTotalWashPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchActivityLog = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:5001/api/activity-log", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Activity log fetch failed: ${response.status}`);
        }

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
          setTotalWashPrice(data.total_spent);
        }
      } catch (error) {
        console.error("Error fetching activity log:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLog();
  }, [mounted, router]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <h1 className="dashboard-top-title">Aktiviteter</h1>

        <section className="auth-header">
          <img
            src="/logo_sort.webp"
            alt="Wash world logo"
            className="auth-logo"
          />

          <button
            type="button"
            className="auth-back-button"
            onClick={() => router.push("/activity")}
          >
            ←
          </button>
        </section>

        <section className="activity-section">
          <h1 className="section-title">Seneste vaske</h1>

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