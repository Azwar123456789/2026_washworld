"use client";

import { useRouter } from "next/navigation";

export default function SentEmailPage() {
  const router = useRouter();

  return (
    <main className="sent-email-page">
      <section className="auth-card">
        <div className="auth-header">
          <button
            type="button"
            className="auth-back-button"
            onClick={() => router.push("/login/form")}
          >
            ←
          </button>

          <img
            src="/images/washworld-logo.png"
            alt="Wash World"
            className="auth-logo"
          />
        </div>

        <div className="auth-content">
          <h1 className="auth-title">Email er sendt</h1>
          <p className="auth-subtitle">
            Der er nu sendt en mail med instruktioner til e-mail adressen, hvis den eksisterer.
          </p>

          <button
            type="button"
            className="auth-submit-button"
            onClick={() => router.push("/login/form")}
          >
            Gå til log ind →
          </button>
        </div>
      </section>
    </main>
  );
}