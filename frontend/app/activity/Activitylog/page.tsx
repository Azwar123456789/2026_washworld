"use client";

import Link from "next/link";

export default function ActivityLogPage() {
  const recentWashes = [
    {
      title: "Guld vask",
      location: "Viby",
      price: "59 kr.",
      date: "20 apr 2026 14:32",
    },
    {
      title: "Premium vask",
      location: "Højbjerg",
      price: "89 kr.",
      date: "24 apr 2026 08:53",
    },
    {
      title: "Brilliant vask",
      location: "Tilst",
      price: "119 kr.",
      date: "26 apr 2026 12:04",
    },
  ];

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <h1 className="dashboard-top-title">Aktiviteter</h1>

        <section className="dashboard-hero">
          <div className="dashboard-hero-top">
            <img
              src="/images/washworld-logo.png"
              alt="Wash World"
              className="dashboard-logo"
            />
          </div>

          <h2 className="dashboard-greeting">Hej, Jonas</h2>
          <p className="dashboard-subtitle">Se dine seneste vask og besparelser</p>
        </section>

        <section className="activity-section">
          <h2 className="section-title">
            <Link href="/activity" className="activity-log-link">
              ← Seneste vaske
            </Link>
          </h2>

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
              <div className="saving-card-icon">💰</div>
              <div>
                <p className="saving-card-title">Værdi af din vask</p>
                <p className="saving-card-value">1234 kr</p>
                <p className="saving-card-note">(uden abonnement)</p>
              </div>
            </div>
            <div className="saving-card">
              <div className="saving-card-icon">💳</div>
              <div>
                <p className="saving-card-title">Du har betalt</p>
                <p className="saving-card-value">1074 kr</p>
                <p className="saving-card-note">(169 kr x 6 mdr)</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
