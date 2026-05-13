"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocations, WashLocation } from "../hooks/useLocations";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replaceAll("æ", "ae")
    .replaceAll("ø", "oe")
    .replaceAll("å", "aa")
    .replaceAll(" ", "-");
}

function getQueueStatus(status: number | string | null | undefined) {
  const statusNum = Number(status || 1);

  if (statusNum <= 3) {
    return {
      label: "Easy",
      color: "#67d27d",
    };
  }

  if (statusNum <= 7) {
    return {
      label: "Normal",
      color: "#d8c93f",
    };
  }

  return {
    label: "Busy",
    color: "#e04b4b",
  };
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function getDistance(
  location: WashLocation,
  userLocation: { lat: number; lng: number } | null
) {
  if (!userLocation || !location.location_lat || !location.location_lng) {
    return null;
  }

  return calculateDistance(
    userLocation.lat,
    userLocation.lng,
    Number(location.location_lat),
    Number(location.location_lng)
  );
}

export default function LocationsPage() {
  const {
    filteredLocations,
    search,
    setSearch,
    isLoading,
    error,
  } = useLocations();

  const [activeFilter, setActiveFilter] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Kunne ikke hente lokation:", error);
      }
    );
  }, []);

  let displayedLocations = [...filteredLocations];

  if (activeFilter === "Easy") {
    displayedLocations = displayedLocations.filter(
      (location) => getQueueStatus(location.que_status).label === "Easy"
    );
  }

  if (activeFilter === "Åben") {
    displayedLocations = displayedLocations.filter((location) =>
      location.location_opening_hours.includes("22:00")
    );
  }

  if (activeFilter === "Afstand" && userLocation) {
    displayedLocations.sort((a, b) => {
      const distanceA = getDistance(a, userLocation) ?? 999999;
      const distanceB = getDistance(b, userLocation) ?? 999999;

      return distanceA - distanceB;
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#efefef",
        paddingBottom: "100px",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          padding: "10px",
        }}
      >
        <h1
          style={{
            fontSize: "16px",
            color: "#b5b5b5",
            marginBottom: "8px",
          }}
        >
          Find Vaskehal
        </h1>

        <div
          style={{
            background: "#000",
            padding: "16px",
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <Image
            src="/logo_sort.webp"
            alt="Wash World"
            width={220}
            height={70}
          />
        </div>

        <h2
          style={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "18px",
          }}
        >
          Find vaskehal
        </h2>

        <div
          style={{
            background: "white",
            borderRadius: "10px",
            border: "1px solid #ddd",
            padding: "12px 14px",
            marginBottom: "14px",
          }}
        >
          <input
            placeholder="Søg efter by eller adresse"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "14px",
              background: "transparent",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "18px",
          }}
        >
          {["Easy", "Åben", "Afstand"].map((filter) => (
            <button
              key={filter}
              onClick={() =>
                setActiveFilter(activeFilter === filter ? "" : filter)
              }
              style={{
                flex: 1,
                background: activeFilter === filter ? "#67d27d" : "white",
                color: activeFilter === filter ? "white" : "#111",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                padding: "10px 8px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {activeFilter === "Afstand" && !userLocation && (
          <p
            style={{
              fontSize: "12px",
              color: "#777",
              marginBottom: "14px",
              textAlign: "center",
            }}
          >
            Tillad lokation i browseren for at sortere efter afstand.
          </p>
        )}

        {isLoading && <p>Loading...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {displayedLocations.map((location) => {
            const distance = getDistance(location, userLocation);
            const queueStatus = getQueueStatus(location.que_status);

            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              location.location_address
            )}`;

            const locationUrl = `/locations/${createSlug(
              location.location_city
            )}`;

            return (
              <div
                key={location.location_pk}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "14px",
                  border: "1px solid #e4e4e4",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        color: "#888",
                        textTransform: "uppercase",
                      }}
                    >
                      Vaskehal
                    </span>

                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        background: queueStatus.color,
                        borderRadius: "50%",
                      }}
                    />

                    <span
                      style={{
                        fontSize: "9px",
                        color: "#888",
                        textTransform: "uppercase",
                      }}
                    >
                      Status: {queueStatus.label}
                    </span>

                    <span
                      style={{
                        fontSize: "9px",
                        color: "#888",
                        textTransform: "uppercase",
                      }}
                    >
                      I kø: {location.in_que ?? 0}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: distance ? "#67d27d" : "#999",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {distance ? `${distance.toFixed(1)} km` : "—"}
                  </div>
                </div>

                <h3
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "28px",
                    fontWeight: 700,
                  }}
                >
                  {location.location_name}
                </h3>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    margin: 0,
                    color: "#777",
                    fontSize: "13px",
                    textDecoration: "underline",
                    display: "inline-block",
                  }}
                >
                  📍 {location.location_address}
                </a>

                <p
                  style={{
                    marginTop: "8px",
                    color: "#444",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  Åbningstid: {location.location_opening_hours}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "10px",
                  }}
                >
                  <Link
                    href={locationUrl}
                    style={{
                      fontSize: "34px",
                      textDecoration: "none",
                      color: "#111",
                      lineHeight: 1,
                    }}
                  >
                    →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}