"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    console.log("EMAIL SENDES:", email);

    try {
      const res = await fetch("http://localhost:5001/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await res.json();
      console.log("SVAR FRA BACKEND:", data);

      if (!res.ok) {
        setError(data.error || "Noget gik galt");
        return;
      }

      router.push("/login/sent-email");
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError("Kunne ikke forbinde til serveren");
    } finally {
      setLoading(false);
    }
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
            Indtast din e-mail, så sender vi dig en e-mail til at nulstille din
            adgangskode.
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

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? "Sender..." : "Send →"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}