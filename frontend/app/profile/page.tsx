"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const { data: fetchedUser, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        throw new Error("No token");
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

      return result.user;
    },
  });

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  const saveProfileMutation = useMutation({
    mutationFn: async (userData: User) => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/api/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_first_name: userData.user_first_name,
          user_email: userData.user_email,
          user_phone: userData.user_phone || "",
          user_license_plate: userData.user_license_plate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kunne ikke gemme ændringer");
      }

      return result.user;
    },
    onMutate: async (newData) => {
      setError("");
      const previousUser = user;
      setUser(newData);
      return { previousUser };
    },
    onError: (err, newData, context) => {
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
      setError(err instanceof Error ? err.message : "Noget gik galt");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setError("");
    },
  });

  function saveProfile() {
    if (!user) return;
    saveProfileMutation.mutate(user);
  }

  function deactivateAccount() {
    const confirmed = confirm(
      "Er du sikker på, at du vil deaktivere din konto?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    fetch(`${baseUrl}/api/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          alert(result.error);
        } else {
          localStorage.removeItem("token");
          alert("Din konto er nu deaktiveret");
          router.push("/login");
        }
      })
      .catch((err) => alert(err.message));
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

  if (!user) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <p className="profile-error">
            {error || "Profil kunne ikke hentes"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className="auth-header">
          <img
            src="/logo_sort.webp"
            alt="Wash world logo"
            className="auth-logo"
          />

          <button
            type="button"
            className="auth-back-button"
            onClick={() => router.push("/locations")}
          >
            ←
          </button>
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

          <button
            onClick={saveProfile}
            className="profile-save-button"
            disabled={saveProfileMutation.isPending}
          >
            {saveProfileMutation.isPending ? "Gemmer..." : "Gem ændringer"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

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
