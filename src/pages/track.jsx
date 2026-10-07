import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../Services/api";
import { statusClass } from "../Services/helpers";

const steps = ["Pending", "In Transit", "Delivered"];

// Public page – anyone with a tracking ID can see the delivery status.
// Only non-private details are shown (no sender / receiver names, no price).
function Track() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await api.get("/shipments");
      const wanted = code.trim().toLowerCase();
      const found = res.data.find((s) => s.trackingId.toLowerCase() === wanted);
      if (found) setResult(found);
      else setError("No shipment found with that tracking ID.");
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  const current = result ? steps.indexOf(result.status) : -1;

  return (
    <div className="track-page">
      <div className="track-box">
        <h1>🔍 Track your shipment</h1>
        <p className="muted">Enter your tracking ID to see where your parcel is. No login needed.</p>

        <form className="track-form" onSubmit={search}>
          <input placeholder="e.g. TRK1001" value={code} onChange={(e) => setCode(e.target.value)} required />
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Searching..." : "Track"}</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>

      {result && (
        <div className="details track-result">
          <div className="card-top">
            <h2>{result.trackingId}</h2>
            <span className={`badge ${statusClass(result.status)}`}>{result.status}</span>
          </div>

          <p className="route">{result.origin} <b>→</b> {result.destination}</p>

          <div className="timeline">
            {steps.map((s, i) => (
              <div key={s} className={i <= current ? "step done" : "step"}>
                <span>{i <= current ? "✓" : i + 1}</span>{s}
              </div>
            ))}
          </div>

          <div className="detail-grid">
            <div className="detail-item"><small>Courier</small><strong>{result.courier}</strong></div>
            <div className="detail-item"><small>Shipment date</small><strong>{result.date}</strong></div>
            <div className="detail-item"><small>Priority</small><strong>{result.priority}</strong></div>
          </div>

          <p className="muted track-foot">Want to book your own shipment? <Link to="/signup">Create a free account</Link></p>
        </div>
      )}
    </div>
  );
}

export default Track;
