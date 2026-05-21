"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function PaymentInformationPage() {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const signupInformation = JSON.parse(
        localStorage.getItem("signup_information") || "{}"
      );

      const selectedSubscription = JSON.parse(
        localStorage.getItem("selected_subscription") || "{}"
      );

      const response = await fetch(`${baseUrl}/api/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_first_name: signupInformation.user_first_name,
          user_email: signupInformation.user_email,
          user_password: signupInformation.user_password,
          user_phone: signupInformation.user_phone,
          user_license_plate: signupInformation.user_license_plate,
          selected_wash: signupInformation.selected_wash,

          package_name: selectedSubscription.package_name,
          subscription_price: selectedSubscription.price,

          card_number: cardNumber,
          card_expiry: cardExpiry,
          card_name: cardName,

          has_all_locations_access: 0,
          extra_location_access_price: 0,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kunne ikke oprette bruger");
      }

      localStorage.removeItem("signup_information");
      localStorage.removeItem("selected_subscription");
      localStorage.removeItem("payment_information");

      router.push("/login/verify-message");

    } catch (err) {
      alert(err instanceof Error ? err.message : "Noget gik galt");
    }
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

            <img
              src="/logo_sort.webp"
              alt="Wash World"
              className="signup-logo payment-logo"
            />
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
                    placeholder="xxx"
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