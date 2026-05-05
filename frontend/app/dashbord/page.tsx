"use client";

import { Bell, MapPin } from "lucide-react";

const locations = [
  {
    name: "Viby",
    address: "Gunnar Clausens Vej 2A, 8260 Viby",
    distance: "14,6 km",
    image: "/images/login-washworld.jpg",
  },
  {
    name: "Højbjerg",
    address: "Bodøstrupvej 20E, 8270 Højbjerg",
    distance: "15,8 km",
    image: "/images/login-washworld.jpg",
  },
  {
    name: "Tilst",
    address: "Blomstervej 2T, 8381 Tilst",
    distance: "21,7 km",
    image: "/images/login-washworld.jpg",
  },
];

const queueData = [
  { name: "Viby", text: "1 i kø / 3 minutter", level: "low" },
  { name: "Højbjerg", text: "3 i kø / 10 minutter", level: "medium" },
  { name: "Tilst", text: "7 i kø / 35 minutter", level: "high" },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <h1 className="dashboard-top-title">Hjem</h1>

        <section className="dashboard-hero">
          <div className="dashboard-hero-top">
            <img
              src="/images/washworld-logo.png"
              alt="Wash World"
              className="dashboard-logo"
            />
            <Bell size={18} color="white" />
          </div>

          <h2 className="dashboard-greeting">Hej, Jonas</h2>
          <p className="dashboard-subtitle">Klar til din næste vask?</p>
        </section>

        <section className="qr-section">
          <div className="qr-image-box">
            <img src="/images/qr-code.png" alt="QR kode" className="qr-image" />
          </div>

          <div className="qr-text-box">
            <h3>Start vask</h3>
            <p>Scan QR-koden på maskinen for at starte vask</p>
            <button className="qr-button">Vis QR-kode</button>
          </div>
        </section>

        <section className="locations-section">
          <h3 className="section-title">Find din nærmeste vaskehal</h3>

          {locations.map((location) => (
            <div key={location.name} className="location-card">
              <img
                src={location.image}
                alt={location.name}
                className="location-image"
              />

              <div className="location-info">
                <h4>{location.name}</h4>
                <p>{location.address}</p>

                <div className="location-map-row">
                  <MapPin size={18} />
                  <a href="#">Vis på kort</a>
                </div>

                <p className="location-distance">{location.distance}</p>
                <a href="#" className="location-more">
                  Læs mere
                </a>
              </div>
            </div>
          ))}

          <button className="show-more-button">Vis flere</button>
        </section>

        <section className="queue-section">
          <h3 className="section-title">Live kø status</h3>

          {queueData.map((item) => (
            <div key={item.name} className="queue-row">
              <div className="queue-name">{item.name}</div>
              <div className="queue-text">{item.text}</div>
              <div className="queue-bars">
                <span className={`queue-bar ${item.level}`}></span>
                <span className={`queue-bar ${item.level}`}></span>
                <span className={`queue-bar ${item.level}`}></span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}