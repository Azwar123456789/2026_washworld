"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();

  const resetKey = params.reset_key as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Du skal udfylde begge felter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Adgangskoderne er ikke ens");
      return;
    }

    try {
      setIsResetting(true);

      const response = await fetch(`${baseUrl}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reset_key: resetKey,
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kunne ikke nulstille adgangskoden");
      }

      setSuccess("Din adgangskode er ændret. Du bliver sendt til login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noget gik galt");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <p className="auth-small-title">Nulstil adgangskode</p>

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
            <h1 className="auth-title">Nulstil adgangskode</h1>

            <p className="auth-subtitle">
              Indtast en ny adgangskode og bekræft den.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Ny adgangskode</label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Indtast ny adgangskode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">
                  Bekræft ny adgangskode
                </label>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Gentag ny adgangskode"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              {success && (
                <p style={{ color: "#28a745", fontWeight: 700 }}>
                  {success}
                </p>
              )}

              <button
                type="submit"
                className="auth-submit-button"
                disabled={isResetting}
              >
                {isResetting
                  ? "Gemmer ny adgangskode..."
                  : "Gem ny adgangskode →"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}