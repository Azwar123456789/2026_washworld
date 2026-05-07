"use client";

export default function ActivityPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <h1 className="dashboard-top-title">Aktivitet</h1>

        <section className="dashboard-hero">
          <div className="dashboard-hero-top">
            <img
              src="/images/washworld-logo.png"
              alt="Wash World"
              className="dashboard-logo"
            />
          </div>

          <h2 className="dashboard-greeting">Hej, Jonas</h2>
          <p className="dashboard-subtitle">Klar til din næste vask?</p>
        </section>

        <section className="activity-content">
          <p>Your activity feed will appear here</p>
        </section>
      </div>
    </main>
  );
}
