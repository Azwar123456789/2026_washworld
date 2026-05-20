"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type User = {
  user_pk: string;
  user_first_name: string;
  user_email: string;
  user_license_plate: string;
  user_phone?: string | null;
  user_membership?: string | null;
  subscription_price?: number | null;
  location_name?: string | null;
  card_last4?: string | null;
  card_expiry?: string | null;
};

export default function ProfilePage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${baseUrl}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Kunne ikke hente profil");
        }

        setUser(result.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noget gik galt");
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, [router]);

  async function saveProfile() {
    try {
      if (!user) return;

      setIsSaving(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/api/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_first_name: user.user_first_name,
          user_email: user.user_email,
          user_phone: user.user_phone || "",
          user_license_plate: user.user_license_plate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kunne ikke gemme ændringer");
      }

      alert("Profil opdateret");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Noget gik galt");
    } finally {
      setIsSaving(false);
    }
  }

  async function deactivateAccount() {
    const confirmed = confirm(
      "Er du sikker på, at du vil deaktivere din konto?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/api/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kunne ikke deaktivere konto");
      }

      localStorage.removeItem("token");
      alert("Din konto er nu deaktiveret");
      router.push("/login");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Noget gik galt");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <p className="profile-error">{error || "Profil kunne ikke hentes"}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div className="dashboard-hero-top">
            <button
              onClick={() => router.back()}
              className="profile-back-button"
            >
              ←
            </button>

            <Image
              src="/logo_hvid.webp"
              alt="Wash World"
              width={180}
              height={60}
            />
          </div>
        </section>

        <section className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.user_first_name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <strong>{user.user_first_name}</strong>
              <p className="profile-email">{user.user_email}</p>
            </div>
          </div>

          <h1 className="profile-page-title">Min Profil</h1>

          <div className="profile-subscription-card">
            <h3 className="profile-card-title">Dit medlemskab</h3>

            <p className="profile-membership-name">
              {user.user_membership || "Intet medlemskab"}
            </p>

            <p className="profile-active">● AKTIV</p>

            <p className="profile-muted-text">
              {user.subscription_price
                ? `${user.subscription_price} kr./md.`
                : "Pris ikke fundet"}
            </p>

            {user.location_name && (
              <p className="profile-muted-text">
                Primær vaskehal: {user.location_name}
              </p>
            )}
          </div>

          <h2 className="profile-section-title">Personlige oplysninger</h2>

          <label className="profile-input-label">Navn</label>
          <input
            className="profile-input"
            value={user.user_first_name}
            onChange={(e) =>
              setUser({ ...user, user_first_name: e.target.value })
            }
          />

          <label className="profile-input-label">Email</label>
          <input
            className="profile-input"
            value={user.user_email}
            onChange={(e) => setUser({ ...user, user_email: e.target.value })}
          />

          <label className="profile-input-label">Telefon</label>
          <input
            className="profile-input"
            value={user.user_phone || ""}
            onChange={(e) => setUser({ ...user, user_phone: e.target.value })}
          />

          <label className="profile-input-label">Nummerplade</label>
          <input
            className="profile-input"
            value={user.user_license_plate}
            onChange={(e) =>
              setUser({ ...user, user_license_plate: e.target.value })
            }
          />

          <button onClick={saveProfile} className="profile-save-button">
            {isSaving ? "Gemmer..." : "Gem ændringer"}
          </button>

          <h2 className="profile-section-title">Betaling</h2>

          <div className="profile-payment-card">
            <span>💳 **** {user.card_last4 || "----"}</span>
            <span className="profile-tag">STANDARD</span>
          </div>

          <div className="profile-payment-row">
            Udløbsdato: {user.card_expiry || "--/--"}
          </div>

          <div className="profile-payment-row">↔ Skift betalingsmetode ›</div>

          <div className="profile-payment-row">↺ Betalingshistorik ›</div>

          <button onClick={logout} className="profile-logout-button">
            Log ud
          </button>

          <button onClick={deactivateAccount} className="profile-delete-button">
            Slet min konto
          </button>
        </section>
      </div>
    </main>
  );
}