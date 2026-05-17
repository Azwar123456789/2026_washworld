"use client";

import ActivityFeed from "./ActivityFeed";

export default function ActivityPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <h1 className="dashboard-top-title">Aktivitet</h1>

        <section className="auth-header">
          <img src="logo_sort.webp" alt="Wash World" className="auth-logo" />
        </section>

        <ActivityFeed />
      </div>
    </main>
  );
}
