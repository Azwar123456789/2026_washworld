"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocations } from "../../hooks/useLocations";

const realAddresses: Record<string, string> = {
  Ishøj: "Vejleåvej 19, 2635 Ishøj",
  Taastrup: "Roskildevej 376, 2630 Taastrup",
  "Brøndby Strand": "Gammel Køge Landevej 690, 2660 Brøndby Strand",
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
};

export default function LocationDetailPage() {
  const params = useParams();

  const { filteredLocations, isLoading, error } = useLocations();

  const location = filteredLocations.find(
    (loc) => String(loc.location_pk) === String(params.id)
  );

  if (isLoading) {
    return <main className="dashboard-page">Loading...</main>;
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <p className="login-error">{error}</p>
      </main>
    );
  }

  if (!location) {
    return (
      <main className="dashboard-page">
        Location not found
      </main>
    );
  }

  const address =
    realAddresses[location.location_name] ||
    location.location_address;

  const coords =
    locationCoordinates[location.location_name];

  const mapsUrl = coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <main className="dashboard-page">

      <div className="dashboard-shell">

        {/* Hero */}
        <section className="dashboard-hero">

          <div className="dashboard-hero-top">

            <Link
              href="/locations"
              style={{
                color: "#69d27f",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              ← Tilbage
            </Link>

          </div>

          <h1 className="dashboard-greeting">
            {location.location_name}
          </h1>

          <p className="dashboard-subtitle">
            {address}
          </p>

        </section>

        {/* Image */}
        <section className="locations-section">

          <img
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1200&auto=format&fit=crop"
            alt="Washhall"
            className="location-image"
            style={{
              height: "220px",
              marginBottom: "18px",
            }}
          />

          <h2 className="section-title">
            Information
          </h2>

          <div className="location-info">

            <p>
              🕒 Åbningstid:
              {" "}
              {location.location_opening_hours}
            </p>

            <p>
              🧼 Moderne vaskehal
            </p>

            <p>
              🚗 Hurtig og effektiv vask
            </p>

            <p>
              🌱 Miljøvenlige produkter
            </p>

            <p className="location-distance">
              ● God kapacitet lige nu
            </p>

          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="show-more-button">
              Rutevejledning
            </button>
          </a>

        </section>

      </div>

    </main>
  );
}