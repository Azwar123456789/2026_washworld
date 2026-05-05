"use client";

import { useRouter } from "next/navigation";

export default function LoginWelcomePage() {
  const router = useRouter();

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

          <button
            type="button"
            className="login-primary-button"
            onClick={() => router.push("/login/form")}
          >
            Log ind
          </button>

          <button
            type="button"
            className="login-secondary-button"
            onClick={() => router.push("/signup")}
          >
            Bliv medlem
          </button>
        </div>
      </section>
    </main>
  );
}