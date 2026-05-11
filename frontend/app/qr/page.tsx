"use client";

import Image from "next/image";

export default function QRPage() {
  return (
    <main className="dashboard-page">

      <div className="dashboard-shell">

        {/* Small title */}
        <h1 className="dashboard-top-title">
          QR kode
        </h1>

        {/* Header */}
        <section
          style={{
            background: "#000",
            padding: "14px",
            marginBottom: "16px",
          }}
        >

          {/* Logo */}
          <div
            style={{
              marginBottom: "22px",
            }}
          >

            <Image
              src="/washworld-logo.png"
              alt="Wash World"
              width={110}
              height={40}
            />

          </div>

          {/* Title */}
          <h2
            style={{
              color: "#67d27d",
              fontSize: "22px",
              fontWeight: 800,
              margin: "0 0 10px 0",
            }}
          >
            Scan QR koden
          </h2>

          <p
            style={{
              color: "white",
              fontSize: "13px",
              margin: 0,
            }}
          >
            Hold din telefon op foran scanneren på maskinen
          </p>

        </section>

        {/* QR Card */}
        <section
          style={{
            background: "#efefef",
            padding: "12px",
            marginBottom: "18px",
          }}
        >

          {/* User */}
          <div
            style={{
              background: "#f8f8f8",
              padding: "12px",
              textAlign: "center",
              marginBottom: "14px",
            }}
          >

            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              Jonas Dereck
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#444",
              }}
            >
              ◉ 832 842
            </p>

          </div>

          {/* QR */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >

            <Image
              src="/qr-placeholder.png"
              alt="QR kode"
              width={280}
              height={280}
              style={{
                width: "100%",
                maxWidth: "280px",
                height: "auto",
              }}
            />

          </div>

        </section>

      </div>

    </main>
  );
}