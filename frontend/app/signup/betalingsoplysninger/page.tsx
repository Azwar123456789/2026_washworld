"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentInformationPage() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    localStorage.setItem(
      "payment_information",
      JSON.stringify({
        card_number: cardNumber,
        card_expiry: cardExpiry,
        card_cvc: cardCvc,
        card_name: cardName,
      })
    );

    router.push("/dashboard");
  }

  return (
    <main className="signup-page">
      <div className="signup-shell payment-shell">
        <p className="signup-small-title">Betalingsoplysninger</p>

        <section className="signup-card">
          <div className="signup-header payment-header">
            <button
              type="button"
              className="signup-back-button"
              onClick={() => router.push("/signup/vaelg-vaskeabonnementer")}
            >
              ←
            </button>

            <img src="/logo_sort.webp" alt="Wash World" className="signup-logo payment-logo" />
          </div>

          <div className="signup-content payment-content">
            <h1 className="signup-title payment-title">
              Tilføj betalingskort
            </h1>

            <p className="payment-text">
              Let og automatisk betaling af dine ubegrænsede medlemskaber eller
              enkeltvask.
            </p>

            <form onSubmit={handleSubmit} className="signup-form">
              <label>Kortnummer</label>
              <input
                type="text"
                placeholder="xxxx- xxxxx- xxxxx- xxxxx"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />

              <div className="payment-row">
                <div>
                  <label>Udløbsdato</label>
                  <input
                    type="text"
                    placeholder="xx - xx"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Sikkerhedskode</label>
                  <input
                    type="text"
                    placeholder="xx - xx"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    required
                  />
                </div>
              </div>

              <label>Navn på kort</label>
              <input
                type="text"
                placeholder="usertest"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />

              <button type="submit" className="signup-main-button payment-button">
                Gem oplysninger
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}