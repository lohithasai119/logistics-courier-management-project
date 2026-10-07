import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../Services/api";
import { getUser } from "../Services/auth";
import { statusClass } from "../Services/helpers";

function Dashboard() {
  const user = getUser();
  const admin = user.role === "admin";
  const [shipments, setShipments] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Admin sees every shipment, a user sees only their own
    api.get("/shipments", { params: admin ? {} : { userId: user.id } })
      .then((res) => setShipments(res.data))
      .catch(console.log);

    if (admin) {
      api.get("/users").then((res) => setUserCount(res.data.length)).catch(console.log);
    }
  }, [admin, user.id]);

  const count = (fn) => shipments.filter(fn).length;
  const total = shipments.length || 1;
  const revenue = shipments.reduce((sum, s) => sum + s.price, 0);
  const stats = [
    ["📦", admin ? "Total Shipments" : "My Shipments", shipments.length, "blue"],
    ["✅", "Delivered", count((s) => s.status === "Delivered"), "green"],
    ["⏳", "Pending", count((s) => s.status === "Pending"), "amber"],
    ["🚚", "In Transit", count((s) => s.status === "In Transit"), "violet"],
    ["⚡", "Priority", count((s) => s.priority === "High"), "red"],
    ["💰", admin ? "Revenue" : "Total Spent", `₹${revenue}`, "teal"],
  ];
  if (admin) stats.push(["👥", "Registered Users", userCount, "blue"]);

  const recent = [...shipments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="dashboard">
      <div className="page-head">
        <div>
          <h1>
            Hello, {user.name} 👋 <em className={`role-pill ${user.role}`}>{admin ? "Admin" : "User"}</em>
          </h1>
          <p className="muted">
            {admin
              ? "Here is what is happening across all shipments today."
              : "Here is the status of your shipments."}
          </p>
        </div>
        <Link to="/add-shipment" className="add-btn">{admin ? "+ Add Shipment" : "+ Book Shipment"}</Link>
      </div>

      <div className="stats">
        {stats.map(([icon, label, value, color]) => (
          <div key={label} className={`stat-card ${color}`}>
            <span className="stat-icon">{icon}</span>
            <h3>{label}</h3>
            <h2>{value}</h2>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <section className="panel">
          <h3>Delivery progress</h3>
          {["Delivered", "In Transit", "Pending"].map((s) => {
            const n = count((x) => x.status === s);
            return (
              <div key={s} className="bar-row">
                <span>{s} ({n})</span>
                <div className="bar"><i className={statusClass(s)} style={{ width: `${(n / total) * 100}%` }} /></div>
              </div>
            );
          })}
        </section>

        <section className="panel">
          <h3>Recent shipments</h3>
          {recent.map((s) => (
            <Link key={s.id} to={`/shipments/${s.id}`} className="recent-row">
              <div><strong>{s.trackingId}</strong><small>{s.origin} → {s.destination}</small></div>
              <span className={`badge ${statusClass(s.status)}`}>{s.status}</span>
            </Link>
          ))}
          {recent.length === 0 && <p className="muted">No shipments yet. Book your first one!</p>}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
