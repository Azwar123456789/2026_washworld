const getStatusLabel = (status) => {
  const statusNum = parseInt(status);
  if (statusNum <= 3) return "Easy";
  if (statusNum <= 7) return "Normal";
  return "Busy";
};

export default function LocationsSection({ locations, loading }) {
  return (
    <section className="locations-section">
      <h3 className="section-title">Find din nærmeste vaskehal</h3>

      {!loading && locations.length > 0 ? (
        locations.map((location) => (
          <div key={location.location_pk} className="location-card">
            <img
              src={
                "https://washworld-wordpress-production.storage.googleapis.com/wp-content/uploads/2021/03/28140259/WashWorld_lokation-e1618300360483.jpg"
              }
              alt={location.location_city}
              className="location-image"
            />

            <div className="location-info">
              <h4>{location.location_city}</h4>
              <p>{location.location_address}</p>

              <div className="location-map-row">
                <a href="#">📍Vis på kort</a>
              </div>

              <div className="location-queue-badge">
                <div className="queue-badge-item">
                  <span className="queue-label">I kø</span>
                  <span className="queue-value">{location.in_que}</span>
                </div>
                <div className="queue-badge-item">
                  <span className="queue-label">Status</span>
                  <span className="queue-value">{getStatusLabel(location.que_status)}</span>
                </div>
              </div>

              <a href="#" className="location-more">
                Læs mere
              </a>
            </div>
          </div>
        ))
      ) : (
        <p>Loading locations...</p>
      )}

      <button className="show-more-button">Vis flere</button>
    </section>
  );
}
