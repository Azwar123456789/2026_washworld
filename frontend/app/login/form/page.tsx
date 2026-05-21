"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginFormPage() {
  const { login, isLoggingIn, error } = useAuth();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await login({
        user_email: userEmail,
        user_password: userPassword,
      });

      router.push("/dashboard");
    } catch (err) {
      console.log("Login failed", err);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">


        <section className="auth-card">
          <div className="auth-header">
            <button
              type="button"
              className="auth-back-button"
              onClick={() => router.push("/login")}
            >
              ←
            </button>

            <img
              src="/logo_sort.webp"
              alt="Wash World"
              className="auth-logo"
            />
          </div>

          <div className="auth-content">
            <h1 className="auth-title">Log ind</h1>

            <p className="auth-subtitle">
              Log ind for at se og rediger dine medlemskaber
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">E-mail</label>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="Indtast email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Adgangskode</label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="************"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="auth-forgot-link"
                onClick={() => router.push("/login/forgot-password")}
              >
                Glemt adgangskode?
              </button>

              {error && <p className="auth-error">{error}</p>}

              <button
                type="submit"
                className="auth-submit-button"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logger ind..." : "Log ind →"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}