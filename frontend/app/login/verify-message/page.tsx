"use client";

import { useRouter } from "next/navigation";

export default function VerifyMessagePage() {
  const router = useRouter();

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <p className="auth-small-title">Bekræft email</p>

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
            <h1 className="auth-title">Tjek din email</h1>

            <p className="auth-subtitle">
              Din konto er oprettet. Vi har sendt dig en email med et link,
              som du skal klikke på for at bekræfte din konto.
            </p>

            <p className="auth-subtitle">
              Når du har bekræftet din email, kan du logge ind.
            </p>

            <button
              type="button"
              className="auth-submit-button"
              onClick={() => router.push("/login")}
            >
              Gå til login →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}