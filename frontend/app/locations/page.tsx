"use client";

import { useLocations } from "../hooks/useLocations";

export default function LocationsPage() {
  const { filteredLocations, search, setSearch, isLoading, error } = useLocations();

  return (
    <main className="page">
      <h1>Find vaskehal</h1>

      <input
        placeholder="Søg efter by eller adresse"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading && <p>Loading locations...</p>}
      {error && <p className="error">{error}</p>}

      <section className="cards">
        {filteredLocations.map((location) => (
          <div className="card" key={location.location_pk}>
            <h2>{location.location_name}</h2>
            <p>{location.location_city}</p>
            <p>{location.location_address}</p>
            <p>Åbningstid: {location.location_opening_hours}</p>
          </div>
        ))}
      </section>

      {filteredLocations.length === 0 && <p>No locations found</p>}
    </main>
  );
}