"use client";

import { useRouter } from "next/navigation";

export default function ChooseSubscriptionPage() {
  const router = useRouter();

  function choosePackage(packageName: string, price: number) {
    localStorage.setItem(
      "selected_subscription",
      JSON.stringify({
        package_name: packageName,
        price: price,
      })
    );

    router.push("/signup/betalingsoplysninger");
  }

  return (
    <main className="signup-page">
      <div className="signup-shell">

        <section className="signup-card no-border">

          <section className="auth-header">
            <img
              src="/logo_sort.webp"
              alt="Wash world logo"
              className="auth-logo"
            />

            <button
              type="button"
              className="auth-back-button"
              onClick={() => router.push("/signup")}
            >
              ←
            </button>
          </section>

          <div className="signup-content">
            <h1 className="signup-title">Vask som passer til dig</h1>

            <div className="package-list">
              <div className="package-card">
                <h3>Guld</h3>
                <p className="package-price">
                  139 <span>kr. / md.</span>
                </p>
                <p>
                  Eller prøv en <span className="green-link">enkeltvask til 59 kr.</span>
                </p>
                <p>God og effektiv</p>
                <p className="green-link">Læs mere</p>

                <button onClick={() => choosePackage("Guld", 139)}>
                  Vælg pakke
                </button>
              </div>

              <div className="package-card active">
                <span className="popular-badge">POPULÆR</span>

                <h3>Guld</h3>
                <p className="package-price">
                  169 <span>kr. / md.</span>
                </p>
                <p>
                  Eller prøv en <span className="green-link">enkeltvask til 89 kr.</span>
                </p>
                <p>Ekstra grundig</p>
                <p className="green-link">Læs mere</p>

                <button onClick={() => choosePackage("Guld", 169)}>
                  Vælg pakke
                </button>
              </div>

              <div className="package-card">
                <h3>Guld</h3>
                <p className="package-price">
                  199 <span>kr. / md.</span>
                </p>
                <p>
                  Eller prøv en <span className="green-link">enkeltvask til 119 kr.</span>
                </p>
                <p>Bedste vask året rundt</p>
                <p className="green-link">Læs mere</p>

                <button onClick={() => choosePackage("Guld", 199)}>
                  Vælg pakke
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}