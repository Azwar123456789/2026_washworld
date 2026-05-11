"use client";

import { useParams } from "next/navigation";
import { useLocations } from "../../hooks/useLocations";

export default function LocationDetailsPage() {
  const params = useParams();

  const { filteredLocations, isLoading, error } =
    useLocations();

  const location = filteredLocations.find(
    (loc) =>
      loc.location_city.toLowerCase() ===
      String(params.id).toLowerCase()
  );

  if (isLoading) {
    return (
      <main className="page">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <p>{error}</p>
      </main>
    );
  }

  if (!location) {
    return (
      <main className="page">
        <p>Vaskehal ikke fundet</p>
      </main>
    );
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location.location_address
  )}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#efefef",
        padding: "16px",
        paddingBottom: "100px",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#000",
            color: "white",
            padding: "26px 20px",
            borderRadius: "0 0 18px 18px",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            {location.location_name}
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#bbb",
              fontSize: "14px",
            }}
          >
            {location.location_address}
          </p>
        </div>

        {/* Info card */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "18px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "14px",
              fontSize: "18px",
            }}
          >
            Information
          </h2>

          <p>
            <strong>By:</strong>{" "}
            {location.location_city}
          </p>

          <p>
            <strong>Adresse:</strong>{" "}
            {location.location_address}
          </p>

          <p>
            <strong>Åbningstid:</strong>{" "}
            {location.location_opening_hours}
          </p>
        </div>

        {/* Maps button */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            background: "#67d27d",
            color: "white",
            textAlign: "center",
            padding: "16px",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "18px",
            boxSizing: "border-box",
          }}
        >
          Åbn i Google Maps
        </a>
      </div>
    </main>
  );
}