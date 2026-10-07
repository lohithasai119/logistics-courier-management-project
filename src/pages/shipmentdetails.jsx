import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../Services/api";
import { canView, canModify, isAdmin } from "../Services/auth";
import { statusClass } from "../Services/helpers";

const steps = ["Pending", "In Transit", "Delivered"];

function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = isAdmin();
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/shipments/${id}`)
      .then((res) => {
        if (canView(res.data)) setShipment(res.data);
        else setError("⛔ Access denied. This shipment belongs to another user.");
      })
      .catch(() => setError("Shipment not found."));
  }, [id]);

  async function updateStatus(status) {
    const res = await api.patch(`/shipments/${id}`, { status });
    setShipment(res.data);
  }

  async function remove() {
    const msg = admin ? "Delete this shipment?" : "Cancel this shipment?";
    if (!window.confirm(msg)) return;
    await api.delete(`/shipments/${id}`);
    navigate("/shipments");
  }

  if (error) return <p className="empty">{error}</p>;
  if (!shipment) return <p className="muted center">Loading...</p>;

  const current = steps.indexOf(shipment.status);
  const allowed = canModify(shipment);
  const items = [
    ["Sender", shipment.sender], ["Receiver", shipment.receiver],
    ["Origin", shipment.origin], ["Destination", shipment.destination],
    ["Courier", shipment.courier], ["Weight", `${shipment.weight} kg`],
    ["Price", `₹${shipment.price}`], ["Shipment Date", shipment.date],
  ];
  if (admin && shipment.createdBy) items.push(["Booked by", shipment.createdBy]);

  return (
    <div className="details">
      <div className="card-top">
        <h1>{shipment.trackingId}</h1>
        <div>
          {shipment.priority === "High" && <span className="badge high">⚡ High Priority</span>}
          <span className={`badge ${statusClass(shipment.status)}`}>{shipment.status}</span>
        </div>
      </div>

      <div className="timeline">
        {steps.map((s, i) => (
          <div key={s} className={i <= current ? "step done" : "step"}>
            <span>{i <= current ? "✓" : i + 1}</span>{s}
          </div>
        ))}
      </div>

      <div className="detail-grid">
        {items.map(([k, v]) => (
          <div key={k} className="detail-item"><small>{k}</small><strong>{v}</strong></div>
        ))}
      </div>

      {/* Only the admin can move a shipment through the delivery stages */}
      {admin && (
        <>
          <h3>Update status</h3>
          <div className="card-actions">
            {steps.map((s) => (
              <button key={s} className="btn-sm ghost" disabled={s === shipment.status}
                      onClick={() => updateStatus(s)}>{s}</button>
            ))}
          </div>
        </>
      )}

      {!admin && !allowed && (
        <p className="note">ℹ️ This shipment is already {shipment.status}, so it can no longer be edited or cancelled.</p>
      )}

      <div className="card-actions footer-actions">
        <Link to="/shipments" className="btn-sm ghost">← Back</Link>
        {allowed && <Link to={`/edit-shipment/${id}`} className="btn-sm">Edit</Link>}
        {allowed && <button className="btn-sm danger" onClick={remove}>{admin ? "Delete" : "Cancel shipment"}</button>}
      </div>
    </div>
  );
}

export default ShipmentDetails;
