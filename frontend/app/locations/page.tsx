"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocations } from "../hooks/useLocations";

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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  let displayedLocations = [...filteredLocations];

  if (activeFilter === "Afstand" && userLocation) {
    displayedLocations.sort((a, b) => {
      const aDistance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        Number(a.location_lat),
        Number(a.location_lng)
      );

      const bDistance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        Number(b.location_lat),
        Number(b.location_lng)
      );

      return aDistance - bDistance;
    });
  }

  if (activeFilter === "Åben nu") {
    displayedLocations = displayedLocations.filter((location) =>
      location.location_opening_hours.includes("22:00")
    );
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
        {/* Small title */}
        <h1
          style={{
            fontSize: "16px",
            color: "#b5b5b5",
            marginBottom: "8px",
          }}
        >
          Find Vaskehal
        </h1>

        {/* Logo */}
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
            src="/washworld-logo.png"
            alt="Wash World"
            width={220}
            height={70}
          />
        </div>

        {/* Title */}
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

        {/* Search */}
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
            placeholder="Søg efter by"
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

        {/* Filter buttons */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "18px",
          }}
        >
          {["God kapacitet", "Åben nu", "Afstand"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === filter ? "" : filter
                  )
                }
                style={{
                  flex: 1,
                  background:
                    activeFilter === filter
                      ? "#67d27d"
                      : "white",
                  color:
                    activeFilter === filter
                      ? "white"
                      : "#111",
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
            )
          )}
        </div>

        {/* Loading */}
        {isLoading && <p>Loading...</p>}

        {/* Error */}
        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {displayedLocations.map((location) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              location.location_address
            )}`;

            const distance =
              userLocation &&
              location.location_lat &&
              location.location_lng
                ? calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    Number(location.location_lat),
                    Number(location.location_lng)
                  ).toFixed(1)
                : null;

            return (
              <Link
                key={location.location_pk}
                href={`/locations/${location.location_city.toLowerCase()}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "14px",
                    border: "1px solid #e4e4e4",
                  }}
                >
                  {/* Top */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
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
                          background: "#67d27d",
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
                        God kapacitet
                      </span>
                    </div>

                    {distance && (
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#67d27d",
                        }}
                      >
                        {distance} km
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "28px",
                      fontWeight: 700,
                    }}
                  >
                    {location.location_name}
                  </h3>

                  {/* Address */}
                  <p
                    style={{
                      margin: 0,
                      color: "#777",
                      fontSize: "13px",
                    }}
                  >
                    📍 {location.location_address}
                  </p>

                  {/* Opening hours */}
                  <p
                    style={{
                      marginTop: "8px",
                      color: "#444",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Åbningstid:{" "}
                    {location.location_opening_hours}
                  </p>

                  {/* Arrow */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "10px",
                    }}
                  >
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: "34px",
                        textDecoration: "none",
                        color: "#111",
                      }}
                    >
                      →
                    </a>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}