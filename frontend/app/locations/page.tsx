"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocations } from "../hooks/useLocations";

const realAddresses: Record<string, string> = {
  Ishøj: "Vejleåvej 19, 2635 Ishøj",
  Taastrup: "Roskildevej 376, 2630 Taastrup",
  "Brøndby Strand": "Gammel Køge Landevej 690, 2660 Brøndby Strand",
  Ballerup: "Skovvej 4, 2750 Ballerup",
};

const locationCoordinates: Record<
  string,
  { lat: number; lng: number }
> = {
  Ishøj: {
    lat: 55.615676,
    lng: 12.351193,
  },

  Taastrup: {
    lat: 55.652414,
    lng: 12.301533,
  },

  "Brøndby Strand": {
    lat: 55.621725,
    lng: 12.411472,
  },

  Ballerup: {
    lat: 55.731226,
    lng: 12.363456,
  },
};

export default function LocationsPage() {
  const {
    filteredLocations,
    search,
    setSearch,
    isLoading,
    error,
  } = useLocations();

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
          Find Vaskehal (Ultra-minimalistisk)
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
            placeholder="Søg"
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

          {["God kapacitet", "Åben nu", "Afstand"].map((filter) => (

            <button
              key={filter}
              style={{
                flex: 1,
                background: "white",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                padding: "10px 8px",
                fontSize: "11px",
              }}
            >
              {filter}
            </button>

          ))}

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

          {filteredLocations.map((location) => {

            const address =
              realAddresses[location.location_name] ||
              location.location_address;

            const coords =
              locationCoordinates[location.location_name];

            const mapsUrl = coords
              ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

            return (

              <Link
                key={location.location_pk}
                href={`/locations/${location.location_pk}`}
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

                    <div
                      style={{
                        textAlign: "right",
                      }}
                    >

                      <div
                        style={{
                          fontSize: "9px",
                          color: "#888",
                          textTransform: "uppercase",
                        }}
                      >
                        Afstand
                      </div>

                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        2.4 km
                      </div>

                    </div>

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
                    📍 {address}
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