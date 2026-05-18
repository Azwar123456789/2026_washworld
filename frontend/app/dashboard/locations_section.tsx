import Link from "next/link";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replaceAll("æ", "ae")
    .replaceAll("ø", "oe")
    .replaceAll("å", "aa")
    .replaceAll(" ", "-");
}

const getStatusLabel = (status) => {
  const statusNum = parseInt(status);
  if (statusNum <= 3) return "Ingen ventetid";
  if (statusNum <= 7) return "Normal ventetid";
  if (isNaN(statusNum)) return "no data";
  return "Lang ventetid";
};

export default function LocationsSection({
  locations,
  loading,
  showAll,
  onShowMore,
  onShowLess,
}) {
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
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.location_address)}`} target="_blank" rel="noopener noreferrer">📍Vis på kort</a>
              </div>

              <div className="location-queue-badge">
                <div className="queue-badge-item">
                  <span className="queue-label">I kø</span>
                  <span className="queue-value">{location.in_que}</span>
                </div>
                <div className="queue-badge-item">
                  <span className="queue-label">Status</span>
                  <span className="queue-value">
                    {getStatusLabel(location.que_status)}
                  </span>
                </div>
              </div>

              <Link href={`/locations/${createSlug(location.location_city)}`} className="location-more">
                Læs mere
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>Loading locations...</p>
      )}

      {!showAll && (
        <button className="show-more-button" onClick={onShowMore}>
          Vis flere
        </button>
      )}
      {showAll && (
        <button className="show-more-button" onClick={onShowLess}>
          Vis mindre
        </button>
      )}
    </section>
  );
}
