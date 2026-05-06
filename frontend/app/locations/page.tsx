"use client";

import Link from "next/link";
import { useLocations } from "../hooks/useLocations";

export default function LocationsPage() {
  const {
    filteredLocations,
    search,
    setSearch,
    isLoading,
    error,
  } = useLocations();

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4">

      {/* Logo */}
      <div className="bg-black rounded-2xl p-4 flex justify-center mb-6">
        <h1 className="text-white text-4xl font-bold tracking-widest">
          WASH WORLD
        </h1>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Find vaskehal
      </h1>

      {/* Search */}
      <input
        placeholder="Søg efter by eller adresse"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-4 rounded-2xl border border-gray-200 mb-6"
      />

      {/* Loading */}
      {isLoading && (
        <p className="text-center">
          Loading locations...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center">
          {error}
        </p>
      )}

      {/* Cards */}
      <div className="space-y-4">

        {filteredLocations.map((location) => (

          <Link
            key={location.location_pk}
            href={`/locations/${location.location_pk}`}
          >

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Vaskehal
                  </p>

                  <h2 className="text-2xl font-bold mt-2">
                    {location.location_name}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {location.location_address}
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    {location.location_city}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    Åbningstid
                  </p>

                  <p className="font-semibold mt-1">
                    {location.location_opening_hours}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">

                <span className="text-green-600 text-sm font-medium">
                  ● God kapacitet
                </span>

                <span className="text-3xl">
                  →
                </span>

              </div>

            </div>

          </Link>

        ))}
      </div>

      {/* Empty */}
      {filteredLocations.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          No locations found
        </p>
      )}
    </div>
  );
}