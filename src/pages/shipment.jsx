import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../Services/api";
import { getUser } from "../Services/auth";
import ShipmentCard from "../components/shipmentcard";

function Shipments() {
  const user = getUser();
  const admin = user.role === "admin";
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Admin -> all shipments. User -> only shipments owned by this user.
    api.get("/shipments", { params: admin ? {} : { userId: user.id } })
      .then((res) => setShipments(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [admin, user.id]);

  async function deleteShipment(s) {
    const msg = admin ? `Delete shipment ${s.trackingId}?` : `Cancel shipment ${s.trackingId}?`;
    if (!window.confirm(msg)) return;
    await api.delete(`/shipments/${s.id}`);
    setShipments((list) => list.filter((x) => x.id !== s.id));
  }

  const text = search.toLowerCase();
  const filtered = shipments
    .filter((s) =>
      [s.trackingId, s.sender, s.receiver, s.destination, s.courier, s.createdBy]
        .join(" ").toLowerCase().includes(text) &&
      (status === "All" || s.status === status) &&
      (!priorityOnly || s.priority === "High"))
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "weight") return b.weight - a.weight;
      return new Date(b.date) - new Date(a.date);
    });

  function exportCSV() {
    const cols = ["trackingId", "sender", "receiver", "origin", "destination", "courier", "status", "priority", "weight", "price", "date"];
    const rows = filtered.map((s) => cols.map((c) => `"${s[c] ?? ""}"`).join(","));
    const blob = new Blob([[cols.join(","), ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "shipments.csv";
    a.click();
  }

  return (
    <div className="shipments-page">
      <div className="page-head">
        <div>
          <h1>{admin ? "All Shipments" : "My Shipments"}</h1>
          <p className="muted">Showing {filtered.length} of {shipments.length} shipments</p>
        </div>
        <div className="head-actions">
          <button className="btn-sm ghost" onClick={exportCSV}>⬇ Export CSV</button>
          <Link to="/add-shipment" className="add-btn">{admin ? "+ Add Shipment" : "+ Book Shipment"}</Link>
        </div>
      </div>

      <div className="filters">
        <input placeholder="🔍 Search tracking ID, name, city, courier" value={search}
               onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option>Pending</option><option>In Transit</option><option>Delivered</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="weight">Heaviest first</option>
        </select>
        <label className="priority-filter">
          <input type="checkbox" checked={priorityOnly} onChange={(e) => setPriorityOnly(e.target.checked)} />
          ⚡ High Priority
        </label>
      </div>

      {!admin && (
        <p className="note">ℹ️ You can edit or cancel a shipment only while its status is <b>Pending</b>.</p>
      )}

      {loading ? <p className="muted center">Loading shipments...</p> : (
        <div className="shipment-list">
          {filtered.length > 0 ? filtered.map((s) => (
            <ShipmentCard key={s.id} shipment={s} onDelete={deleteShipment} />
          )) : <p className="empty">📭 No shipments found. Try changing the filters.</p>}
        </div>
      )}
    </div>
  );
}

export default Shipments;
