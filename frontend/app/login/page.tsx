"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
    <main className="login-page">
      <section className="login-card">
        <h1 className="login-title">Login</h1>

        <img
          src="/images/login-washworld.jpg"
          alt="Wash World"
          className="login-image"
        />

        <div className="login-bottom">
          <p className="login-text">
            Vask din bil hurtigt og nemt
            <br />
            Scan QR og undgå ventetid
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              className="login-input"
              placeholder="Email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />

            <input
              className="login-input"
              placeholder="Password"
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />

            <button
              type="submit"
              className="login-primary-button"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logger ind..." : "Log ind"}
            </button>
          </form>

          <button
            type="button"
            className="login-secondary-button"
            onClick={() => router.push("/signup")}
          >
            Bliv medlem
          </button>

          {error && <p className="login-error">{error}</p>}
        </div>
      </section>
    </main>
  );
}