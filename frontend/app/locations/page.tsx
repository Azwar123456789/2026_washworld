"use client";

import Link from "next/link";
import { useLocations } from "../hooks/useLocations";

const realAddresses: Record<string, string> = {
  Ishøj: "Vejleåvej 19, 2635 Ishøj",
  Taastrup: "Roskildevej 376, 2630 Taastrup",
  "Brøndby Strand": "Gammel Køge Landevej 690, 2660 Brøndby Strand",
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
    <main className="dashboard-page">

      <div className="dashboard-shell">

        {/* Top title */}
        <h1 className="dashboard-top-title">
          Find vaskehal
        </h1>

        {/* Hero */}
        <section className="dashboard-hero">

          <div className="dashboard-hero-top">

            <h2 className="dashboard-greeting">
              Wash World
            </h2>

            <div className="dashboard-bell-icon">
              📍
            </div>

          </div>

          <p className="dashboard-subtitle">
            Find nærmeste vaskehal og få rutevejledning
          </p>

        </section>

        {/* Search */}
        <input
          placeholder="Søg efter by eller adresse"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="login-input"
          style={{ marginBottom: "20px" }}
        />

        {/* Loading */}
        {isLoading && <p>Loading locations...</p>}

        {/* Error */}
        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {/* Locations */}
        <section className="locations-section">

          <h2 className="section-title">
            Wash World lokationer
          </h2>

          {filteredLocations.map((location) => {

            const address =
              realAddresses[location.location_name] ||
              location.location_address;

            return (

              <div
                className="location-card"
                key={location.location_pk}
              >

                {/* Image */}
                <img
                  src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1200&auto=format&fit=crop"
                  alt="Washhall"
                  className="location-image"
                />

                {/* Info */}
                <div className="location-info">

                  <h4>
                    {location.location_name}
                  </h4>

                  <p>
                    {address}
                  </p>

                  <p className="location-distance">
                    Åben nu
                  </p>

                  <div className="location-map-row">

                    <span className="location-map-icon">
                      📍
                    </span>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Åbn i Maps
                    </a>

                  </div>

                  <Link
                    href={`/locations/${location.location_pk}`}
                    className="location-more"
                  >
                    Se mere
                  </Link>

                </div>

              </div>
            );
          })}

          {/* Empty */}
          {filteredLocations.length === 0 && (
            <p>No locations found</p>
          )}

        </section>

      </div>

    </main>
  );
}