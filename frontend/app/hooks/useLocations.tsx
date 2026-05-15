"use client";

import { useEffect, useMemo, useState } from "react";

export type WashLocation = {
  location_pk: string;
  location_name: string;
  location_city: string;
  location_address: string;
  location_opening_hours: string;
  location_lat?: number | string | null;
  location_lng?: number | string | null;
  location_description?: string | null;
  in_que?: number | string | null;
  que_status?: number | string | null;
};

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function useLocations() {
  const [locations, setLocations] = useState<WashLocation[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getLocations() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${baseUrl}/api/locations`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Kunne ikke hente vaskehaller");
        }

        setLocations(result.locations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noget gik galt");
      } finally {
        setIsLoading(false);
      }
    }

    getLocations();
  }, []);

  const filteredLocations = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return locations;
    }

    return locations.filter((location) => {
      return (
        location.location_name.toLowerCase().includes(query) ||
        location.location_city.toLowerCase().includes(query) ||
        location.location_address.toLowerCase().includes(query)
      );
    });
  }, [locations, search]);

  return {
    locations,
    filteredLocations,
    search,
    setSearch,
    isLoading,
    error,
  };
}