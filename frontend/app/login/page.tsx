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

    await login({
      user_email: userEmail,
      user_password: userPassword,
    });

    router.push("/dashboard");
  }

  return (
    <main className="page">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="form">
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

        <button disabled={isLoggingIn}>
          {isLoggingIn ? "Logger ind..." : "Login"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </main>
  );
}