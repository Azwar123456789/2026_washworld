"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1800);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="splash-page">
      <img
        src="/images/washworld-logo.png"
        alt="Wash World"
        className="splash-logo"
      />
    </main>
  );
}