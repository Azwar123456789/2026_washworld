"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call API to send reset email
    router.push("/login/sent-email");
  }

  return (
    <main className="forgot-password-page">
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
          <h1 className="auth-title">Glemt adgangskode</h1>
          <p className="auth-subtitle">
            Indtast din e-mail, så sender vi dig en e-mail til at nulstille din adgangskode.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">E-mail</label>
              <input
                type="email"
                placeholder="Din e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>

            <button type="submit" className="auth-submit-button">
              Send →
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}