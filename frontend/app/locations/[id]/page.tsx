"use client";

import { useParams } from "next/navigation";
import { useLocations } from "../../hooks/useLocations";

const realAddresses: Record<string, string> = {
  Ishøj: "Vejleåvej 19, 2635 Ishøj",
  Taastrup: "Roskildevej 376, 2630 Taastrup",
  "Brøndby Strand": "Gammel Køge Landevej 690, 2660 Brøndby Strand",
};

export default function LocationDetailPage() {
  const params = useParams();

  const { filteredLocations, isLoading, error } = useLocations();

  const location = filteredLocations.find(
    (loc) => String(loc.location_pk) === String(params.id)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Location not found
      </div>
    );
  }

  const address =
    realAddresses[location.location_name] ||
    location.location_address;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}`
  )}`;

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4">

      {/* Header */}
      <div className="bg-black text-white rounded-3xl p-6">

        <p className="text-sm text-gray-400 uppercase">
          Vaskehal
        </p>

        <h1 className="text-4xl font-bold mt-2">
          {location.location_name}
        </h1>

        <p className="text-gray-300 mt-3">
          {address}
        </p>

      </div>

      {/* Info */}
      <div className="bg-white rounded-3xl p-5 mt-6 shadow-sm">

        <h2 className="text-2xl font-bold mb-4">
          Information
        </h2>

        <div className="space-y-3 text-gray-600">

          <p>
            🕒 Åbningstid:
            <span className="font-medium ml-2">
              {location.location_opening_hours}
            </span>
          </p>

          <p>🧼 Moderne vaskehal</p>

          <p>🚗 Hurtig og effektiv vask</p>

          <p>🌱 Miljøvenlige produkter</p>

        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-3xl p-5 mt-6 shadow-sm">

        <h2 className="text-xl font-bold mb-3">
          Status
        </h2>

        <div className="flex items-center gap-2">

          <span className="text-green-500 text-xl">
            ●
          </span>

          <p className="font-medium">
            God kapacitet lige nu
          </p>

        </div>

      </div>

      {/* Maps button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-8 bg-green-500 text-center text-black font-bold py-4 rounded-3xl text-lg"
      >
        Rutevejledning
      </a>

    </div>
  );
}