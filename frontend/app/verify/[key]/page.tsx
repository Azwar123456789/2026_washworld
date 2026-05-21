"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function VerifyAccountPage() {
  const router = useRouter();
  const params = useParams();

  const key = params.key as string;

  const [status, setStatus] = useState("Bekræfter din konto...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyAccount() {
      try {
        const response = await fetch(`${baseUrl}/api/verify/${key}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || result.message || "Kunne ikke bekræfte konto");
        }

        setStatus("Din konto er nu bekræftet. Du bliver sendt til login...");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noget gik galt");
      }
    }

    if (key) {
      verifyAccount();
    }
  }, [key, router]);

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <p className="auth-small-title">Bekræft konto</p>

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
            <h1 className="auth-title">Email-bekræftelse</h1>

            {!error && <p className="auth-subtitle">{status}</p>}

            {error && (
              <>
                <p className="auth-error">{error}</p>

                <button
                  type="button"
                  className="auth-submit-button"
                  onClick={() => router.push("/login")}
                >
                  Tilbage til login →
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}