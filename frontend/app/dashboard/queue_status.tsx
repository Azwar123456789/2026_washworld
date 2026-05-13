const getStatusLabel = (status) => {
  const statusNum = parseInt(status);
  if (statusNum <= 3) return "Easy";
  if (statusNum <= 7) return "Normal";
  return "Busy";
};

export default function QueueStatus({ queueData, loading }) {
  return (
    <section className="queue-section">
      <h3 className="section-title">Live kø status</h3>

      {!loading && queueData.length > 0 ? (
        queueData.map((item) => (
          <div key={item.name} className="queue-row">
            <div className="queue-name">{item.name}</div>
            <div className="queue-text">{item.text}</div>
            <div className="queue-bars">
              <span className={`queue-bar ${item.level}`}></span>
              <span className={`queue-bar ${item.level}`}></span>
              <span className={`queue-bar ${item.level}`}></span>
            </div>
          </div>
        ))
      ) : (
        <p>Loading queue data...</p>
      )}
    </section>
  );
}
