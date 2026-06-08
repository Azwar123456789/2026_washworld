"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LocationsSection from "./locations_section";

const queueLevels = ["low", "medium", "high"];

const getStatusLabel = (status: string | number) => {
  const statusNum = typeof status === "number" ? status : parseInt(status);
  if (statusNum <= 3) return "Easy";
  if (statusNum <= 7) return "Normal";
  return "Busy";
};

export default function DashboardPage() {
  const router = useRouter();
  const [allLocations, setAllLocations] = useState([]);
  const [displayedLocations, setDisplayedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [userName, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No token found");
          router.push("/login");
          return;
        }

        const dashboardRes = await fetch("http://localhost:5001/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!dashboardRes.ok) {
          throw new Error(`Dashboard fetch failed: ${dashboardRes.status}`);
        }
        
        const dashboardData = await dashboardRes.json();
        if (dashboardData.user?.user_first_name) {
          setUserName(dashboardData.user.user_first_name);
        }

        const locationsRes = await fetch("http://localhost:5001/api/locations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!locationsRes.ok) {
          throw new Error(`Locations fetch failed: ${locationsRes.status}`);
        }
        
        const locationsData = await locationsRes.json();
        console.log("API Response:", locationsData);
        
        if (locationsData.error) {
          console.error("API Error:", locationsData.error);
          setAllLocations([]);
        } else {
          const sortedLocations = locationsData.locations || [];
          sortedLocations.sort((a: any, b: any) => {
            const distA = a.distance !== null ? a.distance : Infinity;
            const distB = b.distance !== null ? b.distance : Infinity;
            return distA - distB;
          });
          setAllLocations(sortedLocations);
          setDisplayedLocations(sortedLocations.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted, router]);

  const handleShowMore = () => {
    setShowAll(true);
    setDisplayedLocations(allLocations);
  };

  const handleShowLess = () => {
    setShowAll(false);
    setDisplayedLocations(allLocations.slice(0, 3));
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div className="dashboard-hero-top">
            <img
              src="/logo_sort.webp"
              alt="Wash World"
              className="dashboard-logo"
            />
          </div>

          <h2 className="dashboard-greeting">Hej, {userName}</h2>
          <p className="dashboard-subtitle">Klar til din næste vask?</p>
        </section>

        <section className="qr-section">
          <div className="qr-image-box">
            <img src="/qr-placeholder.png" alt="QR kode" className="qr-image" />
          </div>

          <div className="qr-text-box">
            <h3>Start vask</h3>
            <p>Scan QR-koden på maskinen for at starte vask</p>

            <button className="qr-button" onClick={() => router.push("/qr")}>
              Vis QR-kode
            </button>
          </div>
        </section>

        <LocationsSection locations={displayedLocations} loading={loading} showAll={showAll} onShowMore={handleShowMore} onShowLess={handleShowLess} />
      </div>
    </main>
  );
}
