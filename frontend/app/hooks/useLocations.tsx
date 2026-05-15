"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export type WashLocation = {
  location_pk: string;
  location_name: string;
  location_city: string;
  location_address: string;
  location_opening_hours: string;
  location_lat?: number | string | null;
  location_lng?: number | string | null;
  location_description?: string | null;
};

export function useLocations() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/locations`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not fetch locations");
      }

      return result.locations as WashLocation[];
    },
  });

  const locations = data || [];

  const filteredLocations = locations.filter((location) => {
    const query = search.toLowerCase();

    return (
      location.location_city.toLowerCase().includes(query) ||
      location.location_name.toLowerCase().includes(query) ||
      location.location_address.toLowerCase().includes(query)
    );
  });

  return {
    locations,
    filteredLocations,
    search,
    setSearch,
    isLoading,
    error: error?.message || "",
  };
}