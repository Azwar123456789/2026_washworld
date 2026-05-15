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
};

export default function ProfilePage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const [userFirstName, setUserFirstName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userLicensePlate, setUserLicensePlate] = useState("");
  const [userMembership, setUserMembership] = useState("Guld");

  const [message, setMessage] = useState("");
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
          throw new Error(result.error || "Kunne ikke hente bruger");
        }

        const user: User = result.user;

        setUserFirstName(user.user_first_name);
        setUserEmail(user.user_email);
        setUserPhone(user.user_phone || "");
        setUserLicensePlate(user.user_license_plate);
        setUserMembership(user.user_membership || "Guld");
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
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/api/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_first_name: userFirstName,
          user_email: userEmail,
          user_phone: userPhone,
          user_license_plate: userLicensePlate,
          user_membership: userMembership,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kunne ikke gemme ændringer");
      }

      setMessage("Ændringer gemt");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noget gik galt");
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "28px",
            }}
          >
            <div style={avatarStyle}>
              {userFirstName.slice(0, 2).toUpperCase()}
            </div>

            <strong>{userFirstName}</strong>
          </div>

          <h1
            style={{
              textAlign: "center",
              fontSize: "26px",
              marginBottom: "28px",
            }}
          >
            Min Profil
          </h1>

          <div style={subscriptionCardStyle}>
            <h3
              style={{
                margin: "0 0 14px",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              Dit medlemskab
            </h3>

            <select
              value={userMembership}
              onChange={(e) => setUserMembership(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                fontSize: "16px",
                marginBottom: "18px",
                background: "white",
              }}
            >
              <option value="Guld">Guld</option>
              <option value="Premium">Premium</option>
              <option value="Brilliant">Brilliant</option>
            </select>

            <p
              style={{
                color: "#67d27d",
                fontSize: "12px",
                fontWeight: 800,
                marginBottom: "10px",
              }}
            >
              ● AKTIV
            </p>

            <p
              style={{
                color: "#777",
                fontSize: "13px",
                margin: 0,
              }}
            >
              Du kan ændre medlemskab når som helst.
            </p>
          </div>

          <h2
            style={{
              textAlign: "center",
              fontSize: "16px",
              marginBottom: "22px",
            }}
          >
            Personlige oplysninger
          </h2>

          <label style={labelStyle}>NAVN</label>
          <input
            value={userFirstName}
            onChange={(e) => setUserFirstName(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>EMAIL</label>
          <input
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>TELEFON</label>
          <input
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>NUMMERPLADE</label>
          <input
            value={userLicensePlate}
            onChange={(e) =>
              setUserLicensePlate(e.target.value.toUpperCase())
            }
            style={inputStyle}
          />

          {message && (
            <p style={{ color: "#67d27d", textAlign: "center" }}>
              {message}
            </p>
          )}

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button onClick={saveProfile} style={greenButtonStyle}>
            Gem ændringer
          </button>

          <h2
            style={{
              textAlign: "center",
              fontSize: "16px",
              marginBottom: "18px",
              marginTop: "34px",
            }}
          >
            Betaling
          </h2>

          <div style={paymentCardStyle}>
            <span>💳 **** 4242</span>
            <span style={tagStyle}>STANDARD</span>
          </div>

          <div style={paymentRowStyle}>
            ↔ Skift betalingsmetode ›
          </div>

          <div style={paymentRowStyle}>
            ↺ Betalingshistorik ›
          </div>

          <button onClick={logout} style={logoutButtonStyle}>
            Log ud
          </button>
        </section>
      </div>
    </main>
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

const subscriptionCardStyle = {
  border: "1px solid #e5e5e5",
  borderRadius: "10px",
  padding: "22px",
  textAlign: "center",
  marginBottom: "30px",
} as const;

const labelStyle = {
  display: "block",
  fontSize: "10px",
  color: "#999",
  fontWeight: 900,
  margin: "14px 0 6px",
} as const;

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "13px",
  fontSize: "14px",
} as const;

const greenButtonStyle = {
  width: "100%",
  background: "#67d27d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "15px",
  fontWeight: 900,
  marginTop: "20px",
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