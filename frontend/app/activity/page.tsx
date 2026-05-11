"use client";

import ActivityFeed from "./ActivityFeed";

export default function ActivityPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <h1 className="dashboard-top-title">Aktivitet</h1>

        <section className="dashboard-hero">
          <div className="dashboard-hero-top">
            <img
              src="logo_hvid.webp"
              alt="Wash World"
              className="dashboard-logo"
            />
          </div>


        </section>

        <ActivityFeed />
      </div>
    </main>
  );
}
