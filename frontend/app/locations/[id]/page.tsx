"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocations } from "../../hooks/useLocations";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replaceAll("æ", "ae")
    .replaceAll("ø", "oe")
    .replaceAll("å", "aa")
    .replaceAll(" ", "-");
}

function getCapacity(index: number) {
  const capacities = [
    { label: "God kapacitet", color: "#67d27d" },
    { label: "Medium kapacitet", color: "#d8c93f" },
    { label: "Dårlig kapacitet", color: "#e04b4b" },
  ];

  return capacities[index % 3];
}

export default function LocationDetailsPage() {
  const params = useParams();

  const { filteredLocations, isLoading, error } = useLocations();

  const locationIndex = filteredLocations.findIndex(
    (loc) => createSlug(loc.location_city) === String(params.id)
  );

  const location = filteredLocations[locationIndex];
  const capacity = getCapacity(locationIndex >= 0 ? locationIndex : 0);

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
      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        <Link
          href="/locations"
          style={{
            color: "#67d27d",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "14px",
          }}
        >
          ← Tilbage
        </Link>

        <div
          style={{
            background: "#000",
            color: "white",
            padding: "26px 20px",
            borderRadius: "18px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              color: capacity.color,
              fontWeight: 800,
              fontSize: "14px",
            }}
          >
            ● {capacity.label}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            {location.location_name}
          </h1>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: "10px",
              color: "#bbb",
              fontSize: "14px",
              display: "inline-block",
            }}
          >
            📍 {location.location_address}
          </a>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "14px", fontSize: "18px" }}>
            Information
          </h2>

          <p>
            <strong>By:</strong> {location.location_city}
          </p>

          <p>
            <strong>Adresse:</strong> {location.location_address}
          </p>

          <p>
            <strong>Åbningstid:</strong> {location.location_opening_hours}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: capacity.color, fontWeight: 800 }}>
              {capacity.label}
            </span>
          </p>
        </div>

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
          Åbn adresse i Maps
        </a>
      </div>
    </main>
  );
}