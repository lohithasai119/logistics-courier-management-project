import { useEffect, useState } from "react";
import api from "../Services/api";
import { getUser } from "../Services/auth";

// Admin-only page: see all registered users, promote / demote, delete.
function Users() {
  const me = getUser();
  const [users, setUsers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/users"), api.get("/shipments")])
      .then(([u, s]) => { setUsers(u.data); setShipments(s.data); })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  async function changeRole(u, role) {
    const res = await api.patch(`/users/${u.id}`, { role });
    setUsers((list) => list.map((x) => (x.id === u.id ? res.data : x)));
  }

  async function remove(u) {
    if (!window.confirm(`Delete user ${u.name}? Their shipments will stay in the system.`)) return;
    await api.delete(`/users/${u.id}`);
    setUsers((list) => list.filter((x) => x.id !== u.id));
  }

  const countOf = (u) => shipments.filter((s) => String(s.userId) === String(u.id)).length;
  const text = search.toLowerCase();
  const shown = users.filter((u) => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(text));
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="users-page">
      <div className="page-head">
        <div>
          <h1>👥 Users</h1>
          <p className="muted">{users.length} registered · {admins} admin(s) · {users.length - admins} customer(s)</p>
        </div>
      </div>

      <div className="filters">
        <input placeholder="🔍 Search name, email or role" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <p className="muted center">Loading users...</p> : (
        <div className="users-grid">
          {shown.map((u) => {
            const isMe = String(u.id) === String(me.id);
            return (
              <div key={u.id} className="user-card">
                <div className="avatar">{u.name.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                  <strong>{u.name} {isMe && <small>(you)</small>}</strong>
                  <small>{u.email}</small>
                  <small>📦 {countOf(u)} shipment(s)</small>
                </div>
                <em className={`role-pill ${u.role || "user"}`}>{u.role === "admin" ? "Admin" : "User"}</em>
                <div className="card-actions">
                  {u.role === "admin" ? (
                    <button className="btn-sm ghost" disabled={isMe} onClick={() => changeRole(u, "user")}>Make User</button>
                  ) : (
                    <button className="btn-sm ghost" onClick={() => changeRole(u, "admin")}>Make Admin</button>
                  )}
                  <button className="btn-sm danger" disabled={isMe} onClick={() => remove(u)}>Delete</button>
                </div>
              </div>
            );
          })}
          {shown.length === 0 && <p className="empty">No users found.</p>}
        </div>
      )}
    </div>
  );
}

export default Users;
