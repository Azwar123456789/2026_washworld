"use client";

import { useRouter } from "next/navigation";
import Button from "../../components/Button";

export default function LoginWelcomePage() {
  const router = useRouter();

  return (
    <main className="login-page">
      <section className="login-card">


        <div className="login-image-wrapper">
          <img
            src="/hero.webp"
            alt="Wash World"
            className="login-image"
          />
        </div>


        <div className="login-bottom">
          <p className="login-text">
            Vask din bil hurtigt og nemt
            <br />
            Scan QR og undgå ventetid
          </p>

          <Button size="lg" onClick={() => router.push("/login/form")}>
            Log ind
          </Button>


          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push("/signup")}
          >
            Bliv medlem
          </Button>
        </div>

      </section>
    </main>
  );
}