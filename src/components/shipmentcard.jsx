import { Link } from "react-router-dom";
import { canModify, isAdmin } from "../Services/auth";
import { statusClass } from "../Services/helpers";


function ShipmentCard({ shipment, onDelete }) {
  const high = shipment.priority === "High";
  const allowed = canModify(shipment);
  const admin = isAdmin();

  return (
    <div className={high ? "shipment-card is-priority" : "shipment-card"}>
      <div className="card-top">
        <h3>{shipment.trackingId}</h3>
        <div>
          {high && <span className="badge high">⚡ High</span>}
          <span className={`badge ${statusClass(shipment.status)}`}>{shipment.status}</span>
        </div>
      </div>

      <p className="route">{shipment.origin} <b>→</b> {shipment.destination}</p>

      <div className="card-meta">
        <span>👤 {shipment.sender}</span>
        <span>📥 {shipment.receiver}</span>
        <span>🚚 {shipment.courier}</span>
        <span>⚖️ {shipment.weight} kg</span>
        {admin && shipment.createdBy && <span>🧾 Owner: {shipment.createdBy}</span>}
      </div>

      <div className="card-actions">
        <Link to={`/shipments/${shipment.id}`} className="btn-sm">Details</Link>
        {allowed && <Link to={`/edit-shipment/${shipment.id}`} className="btn-sm ghost">Edit</Link>}
        {allowed && (
          <button className="btn-sm danger" onClick={() => onDelete(shipment)}>
            {admin ? "Delete" : "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ShipmentCard;
