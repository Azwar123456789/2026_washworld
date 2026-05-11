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
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [userFirstName, setUserFirstName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userLicensePlate, setUserLicensePlate] = useState("");
  const [message, setMessage] = useState("");
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
          throw new Error(result.error || "Could not load user");
        }

        setUser(result.user);
        setUserFirstName(result.user.user_first_name);
        setUserEmail(result.user.user_email);
        setUserLicensePlate(result.user.user_license_plate);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    }

    getUser();
  }, [router]);

  async function saveProfile() {
    try {
      setIsSaving(true);
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
          user_license_plate: userLicensePlate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not update profile");
      }

      setMessage("Ændringer gemt");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (!user) {
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
            <button
              onClick={() => router.back()}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                border: "3px solid #67d27d",
                background: "transparent",
                color: "#67d27d",
                fontWeight: 900,
                fontSize: "18px",
              }}
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

        <section
          style={{
            background: "white",
            padding: "22px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "#67d27d",
                color: "#000",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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

          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "10px",
              padding: "22px",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ margin: "0 0 8px" }}>Guld pakke</h3>

            <p
              style={{
                fontSize: "34px",
                fontWeight: 900,
                margin: 0,
              }}
            >
              299
              <span style={{ fontSize: "14px", fontWeight: 400 }}>
                {" "}
                kr. / md.
              </span>
            </p>

            <p
              style={{
                color: "#67d27d",
                fontSize: "12px",
                fontWeight: 800,
                marginTop: "4px",
              }}
            >
              ● AKTIV
            </p>

            <p
              style={{
                color: "#999",
                fontSize: "12px",
                marginBottom: "18px",
              }}
            >
              Næste fornyelse: 01. næste måned
            </p>

            <button
              style={{
                background: "#67d27d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "13px 18px",
                fontWeight: 800,
              }}
            >
              Administrer abonnement
            </button>
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

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>NAVN</label>
            <input
              value={userFirstName}
              onChange={(e) => setUserFirstName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>EMAIL</label>
            <input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>TELEFON</label>
            <input
              value="+45 12 34 56 78"
              disabled
              style={{
                ...inputStyle,
                color: "#999",
                background: "#f5f5f5",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>NUMMERPLADE</label>
            <input
              value={userLicensePlate}
              onChange={(e) => setUserLicensePlate(e.target.value.toUpperCase())}
              style={inputStyle}
            />
          </div>

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

          <button
            onClick={saveProfile}
            disabled={isSaving}
            style={{
              width: "100%",
              background: "#67d27d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "15px",
              fontWeight: 900,
              marginBottom: "32px",
            }}
          >
            {isSaving ? "Gemmer..." : "Gem ændringer"}
          </button>

          <h2
            style={{
              textAlign: "center",
              fontSize: "16px",
              marginBottom: "18px",
            }}
          >
            Betaling
          </h2>

          <div style={paymentCardStyle}>
            <span>💳 **** 4242</span>
            <span style={tagStyle}>STANDARD</span>
          </div>

          <div style={paymentRowStyle}>↔ Skift betalingsmetode ›</div>
          <div style={paymentRowStyle}>↺ Betalingshistorik ›</div>

          <button
            onClick={logout}
            style={{
              width: "100%",
              background: "#000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "16px",
              fontWeight: 900,
              fontSize: "17px",
              marginTop: "24px",
            }}
          >
            Log ud
          </button>
        </section>
      </div>
    </main>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "10px",
  color: "#999",
  fontWeight: 900,
  marginBottom: "6px",
} as const;

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "13px",
  fontSize: "14px",
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