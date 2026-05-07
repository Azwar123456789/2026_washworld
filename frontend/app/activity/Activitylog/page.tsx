"use client";

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
    <main className="activity-page">
      <div className="activity-shell">
        <header className="activity-header">
          <p className="activity-label">WASH WORLD</p>
          <h1>Aktiviteter</h1>
        </header>

        <section className="activity-section">
          <p className="activity-subtitle">Seneste vaske</p>

          <div className="activity-list">
            {recentWashes.map((wash) => (
              <article key={wash.date} className="activity-card">
                <div className="activity-card-icon">🚗</div>
                <div className="activity-card-content">
                  <div className="activity-card-top">
                    <div>
                      <h2>{wash.title}</h2>
                      <p>{wash.location}</p>
                    </div>
                    <span className="activity-card-price">{wash.price}</span>
                  </div>
                  <div className="activity-card-date">{wash.date}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="savings-section">
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
