"use client";

import ActivityFeed from "./ActivityFeed";

export default function ActivityPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">


        <section className="auth-header">
          <img
            src="/logo_sort.webp"
            alt="Wash world logo"
            className="auth-logo"
          />
        </section>

        <ActivityFeed />
      </div>
    </main>
  );
}
