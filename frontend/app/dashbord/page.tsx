"use client";

import { useQuery } from "@tanstack/react-query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not load dashboard");
      }

      return result;
    },
  });

  if (isLoading) return <p>Loading dashboard...</p>;
  if (error) return <p>Du skal være logget ind.</p>;

  return (
    <main className="page">
      <h1>Wash World Dashboard</h1>

      <section className="cards">
        <div className="card">
          <h2>Hej {data.user.user_first_name}</h2>
          <p>Email: {data.user.user_email}</p>
          <p>Nummerplade: {data.user.user_license_plate}</p>
        </div>

        <div className="card">
          <h2>Abonnement</h2>
          <p>{data.user.subscription_name}</p>
          <p>{data.user.subscription_price} kr. / måned</p>
        </div>

        <div className="card">
          <h2>Antal vaske</h2>
          <p>{data.stats.total_washes}</p>
        </div>

        <div className="card">
          <h2>Sparede penge</h2>
          <p>{data.stats.total_saved} kr.</p>
        </div>
      </section>
    </main>
  );
}