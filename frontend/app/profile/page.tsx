"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

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
          <p style={{ color: "red", padding: "20px" }}>
            {error || "Profil kunne ikke hentes"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div className="dashboard-hero-top">
            <button onClick={() => router.back()} style={backButtonStyle}>
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

        <section style={{ background: "white", padding: "22px 18px" }}>
          <div style={profileHeaderStyle}>
            <div style={avatarStyle}>
              {user.user_first_name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <strong>{user.user_first_name}</strong>
              <p style={{ margin: 0, color: "#777", fontSize: "13px" }}>
                {user.user_email}
              </p>
            </div>
          </div>

          <h1 style={pageTitleStyle}>Min Profil</h1>

          <div style={subscriptionCardStyle}>
            <h3 style={cardTitleStyle}>Dit medlemskab</h3>

            <p style={membershipNameStyle}>
              {user.user_membership || "Intet medlemskab"}
            </p>

            <p style={activeStyle}>● AKTIV</p>

            <p style={mutedTextStyle}>
              {user.subscription_price
                ? `${user.subscription_price} kr./md.`
                : "Pris ikke fundet"}
            </p>

            {user.location_name && (
              <p style={mutedTextStyle}>
                Primær vaskehal: {user.location_name}
              </p>
            )}
          </div>

          <h2 style={sectionTitleStyle}>Personlige oplysninger</h2>

          <InfoRow label="Navn" value={user.user_first_name} />
          <InfoRow label="Email" value={user.user_email} />
          <InfoRow label="Telefon" value={user.user_phone || "Ikke angivet"} />
          <InfoRow label="Nummerplade" value={user.user_license_plate} />

          <h2 style={sectionTitleStyle}>Betaling</h2>

          <div style={paymentCardStyle}>
            <span>💳 **** {user.card_last4 || "----"}</span>
            <span style={tagStyle}>STANDARD</span>
          </div>

          <div style={paymentRowStyle}>
            Udløbsdato: {user.card_expiry || "--/--"}
          </div>

          <div style={paymentRowStyle}>↔ Skift betalingsmetode ›</div>

          <div style={paymentRowStyle}>↺ Betalingshistorik ›</div>

          <button onClick={logout} style={logoutButtonStyle}>
            Log ud
          </button>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRowStyle}>
      <span style={infoLabelStyle}>{label}</span>
      <strong style={infoValueStyle}>{value}</strong>
    </div>
  );
}

const backButtonStyle = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  border: "3px solid #67d27d",
  background: "transparent",
  color: "#67d27d",
  fontWeight: 900,
  fontSize: "18px",
} as const;

const profileHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "28px",
} as const;

const avatarStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#67d27d",
  color: "#000",
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

const pageTitleStyle = {
  textAlign: "center",
  fontSize: "26px",
  marginBottom: "28px",
} as const;

const subscriptionCardStyle = {
  border: "1px solid #e5e5e5",
  borderRadius: "12px",
  padding: "22px",
  textAlign: "center",
  marginBottom: "30px",
} as const;

const cardTitleStyle = {
  margin: "0 0 14px",
  fontSize: "22px",
  fontWeight: 800,
} as const;

const membershipNameStyle = {
  fontSize: "28px",
  fontWeight: 900,
  margin: "0 0 10px",
} as const;

const activeStyle = {
  color: "#67d27d",
  fontSize: "12px",
  fontWeight: 900,
  marginBottom: "10px",
} as const;

const mutedTextStyle = {
  color: "#777",
  fontSize: "13px",
  margin: "6px 0",
} as const;

const sectionTitleStyle = {
  textAlign: "center",
  fontSize: "16px",
  marginBottom: "18px",
  marginTop: "30px",
} as const;

const infoRowStyle = {
  border: "1px solid #eee",
  borderRadius: "10px",
  padding: "14px",
  marginBottom: "10px",
} as const;

const infoLabelStyle = {
  display: "block",
  color: "#999",
  fontSize: "10px",
  fontWeight: 900,
  textTransform: "uppercase",
  marginBottom: "5px",
} as const;

const infoValueStyle = {
  fontSize: "15px",
  color: "#111",
} as const;

const paymentCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
} as const;

const paymentRowStyle = {
  border: "1px solid #eee",
  borderRadius: "8px",
  padding: "14px",
  marginBottom: "10px",
  color: "#555",
  fontSize: "14px",
} as const;

const tagStyle = {
  background: "#eee",
  color: "#777",
  fontSize: "10px",
  padding: "4px 7px",
  borderRadius: "4px",
  fontWeight: 900,
} as const;

const logoutButtonStyle = {
  width: "100%",
  background: "#000",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "16px",
  fontWeight: 900,
  fontSize: "17px",
  marginTop: "24px",
} as const;