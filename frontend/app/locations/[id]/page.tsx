"use client";

import { useParams } from "next/navigation";
import { useLocations } from "../../hooks/useLocations";
import { useRouter } from "next/navigation";
import Button from "../../../components/Button";

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
    { label: "God kapacitet", className: "capacity-good" },
    { label: "Medium kapacitet", className: "capacity-medium" },
    { label: "Dårlig kapacitet", className: "capacity-bad" },
  ];

  return capacities[index % 3];
}

export default function LocationDetailsPage() {
  const router = useRouter();
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
    <main className="location-details-page">
      <div className="location-details-shell">

        <section className="auth-header">
          <img
            src="/logo_sort.webp"
            alt="Wash world logo"
            className="auth-logo"
          />

          <button
            type="button"
            className="auth-back-button"
            onClick={() => router.push("/locations")}
          >
            ←
          </button>
        </section>

        <section className="location-hero">
          <p className="location-small-title">STATION</p>

          <h1 className="location-main-title">
            {location.location_name}
          </h1>

          <p>{location.location_address}</p>

          <p className={`location-capacity ${capacity.className}`}>
            ● {capacity.label}
          </p>
        </section>

        <section className="wait-card">
          <div className="wait-label">VENTETID</div>

          <div className="wait-time">
            <span className="wait-number">5</span>
            <span className="wait-min">MIN</span>
          </div>

          <Button
            size="lg"
            onClick={() => window.open(mapsUrl, "_blank")}
          >
            Rutevejledning
          </Button>

        </section>

        <section className="location-description">
          <h2>{location.location_name}</h2>

          <p>
            Hos Wash World i Roskildevej tilbyder vi en lynhurtig og
            effektiv bilvask, der passer ind i din travle hverdag.
            Vores station på Roskildevej 376 er udstyret med den nyeste
            teknologi inden for miljørigtig bilpleje.
          </p>

          <p>
            {location.location_description}
          </p>

        </section>

        <section className="location-info-section">
          <h2 className="location-info-title">
            Information
          </h2>

          <div className="location-info-card">

            <div className="location-info-row">
              <div className="location-info-left">
                <span>🕒</span>

                <span className="location-info-label">
                  Åbningstider
                </span>
              </div>

              <span className="location-info-value">
                {location.location_opening_hours}
              </span>
            </div>

            <div className="location-info-row">
              <div className="location-info-left">
                <span>↕</span>

                <span className="location-info-label">
                  Max Højde
                </span>
              </div>

              <span className="location-info-value">
                2,6 m
              </span>
            </div>

            <div className="location-info-row">
              <div className="location-info-left">
                <span>↔</span>

                <span className="location-info-label">
                  Max Bredde
                </span>
              </div>

              <span className="location-info-value">
                2,55 m
              </span>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}