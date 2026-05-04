"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function SignUpPage() {
  const { signUp, isSigningUp, error } = useAuth();

  const [userFirstName, setUserFirstName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userLicensePlate, setUserLicensePlate] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await signUp({
      user_first_name: userFirstName,
      user_email: userEmail,
      user_password: userPassword,
      user_license_plate: userLicensePlate,
    });

    setMessage(result.message);
  }

  return (
    <main className="page">
      <h1>Opret bruger</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Navn"
          value={userFirstName}
          onChange={(e) => setUserFirstName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />

        <input
          placeholder="Nummerplade"
          value={userLicensePlate}
          onChange={(e) => setUserLicensePlate(e.target.value)}
        />

        <button disabled={isSigningUp}>
          {isSigningUp ? "Opretter..." : "Opret bruger"}
        </button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </main>
  );
}