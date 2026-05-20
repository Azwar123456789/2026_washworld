"use client";

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [userFirstName, setUserFirstName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userLicensePlate, setUserLicensePlate] = useState("");
  const [selectedWash, setSelectedWash] = useState("");

  function goToPackageStep(e: React.FormEvent) {
    e.preventDefault();

    localStorage.setItem(
      "signup_information",
      JSON.stringify({
        user_first_name: userFirstName,
        user_email: userEmail,
        user_password: userPassword,
        user_phone: userPhone,
        user_license_plate: userLicensePlate,
        selected_wash: selectedWash,
      })
    );

    router.push("/signup/vaelg-vaskeabonnementer");
  }

  return (
    <main className="signup-page">
      <div className="signup-shell">
        <p className="signup-small-title">Signup</p>

        <section className="signup-card">
          <div className="signup-header">
            <button
              type="button"
              className="signup-back-button"
              onClick={() => router.push("/login")}
            >
              ←
            </button>

            <img src="/logo_sort.webp" alt="Wash World" className="signup-logo" />
          </div>

          <div className="signup-content">
            <h1 className="signup-title">Dine oplysninger</h1>

            <p className="signup-login-text">
              Har du allerede en Wash World profil?{" "}
              <button type="button" onClick={() => router.push("/login/form")}>
                Log ind
              </button>
            </p>

            <form onSubmit={goToPackageStep} className="signup-form">
              <label>Fulde navn</label>
              <input
                type="text"
                placeholder="Indtast navn"
                value={userFirstName}
                onChange={(e) => setUserFirstName(e.target.value)}
                required
              />

              <label>E-mail</label>
              <input
                type="email"
                placeholder="Indtast email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />

              <label>Adgangskode</label>
              <input
                type="password"
                placeholder="************"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />

              <label>Mobilnr.</label>
              <input
                type="text"
                placeholder="Indtast Mobil nr"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />

              <label>Nummerplade</label>
              <input
                type="text"
                placeholder="Indtast Nummerplade"
                value={userLicensePlate}
                onChange={(e) => setUserLicensePlate(e.target.value)}
                required
              />

              <label>Hvor vil du vaske?</label>
              <select
                value={selectedWash}
                onChange={(e) => setSelectedWash(e.target.value)}
                required
              >
                <option value="">Vælg primær vaskehal</option>
                <option value="Køge">Wash World Køge</option>
                <option value="Roskilde">Wash World Roskilde</option>
                <option value="Ishøj">Wash World Ishøj</option>
              </select>

              <p className="signup-info-text">
                Tilkøb <b>fri adgang til alle vaskehaller</b> og vask i alle vores
                130 andre vaskehaller uden ekstra beregning.
              </p>

              <label className="signup-checkbox">
                <input type="checkbox" />
                <span>Fri adgang til alle vaskehaller</span>
                <b>10 kr./md.</b>
              </label>

              <label className="signup-checkbox">
                <input type="checkbox" required />
                <span>
                  Jeg accepterer Wash Worlds vilkår og at Wash World må sende mig tilbud.
                </span>
              </label>

              <button type="submit" className="signup-main-button">
                Vælg vaskeabonnementer
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}