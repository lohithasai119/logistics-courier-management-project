// Small helper for login session + role checks (Admin / User)

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export const isLoggedIn = () => !!getUser();
export const isAdmin = () => getUser()?.role === "admin";

export function saveSession(u) {
  const user = { id: u.id, name: u.name, email: u.email, role: u.role || "user" };
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("userName", user.name);
}

export function clearSession() {
  ["user", "loggedIn", "userName"].forEach((k) => localStorage.removeItem(k));
}

// Admin can see everything. A user can see only the shipments they own.
export function canView(shipment) {
  const u = getUser();
  if (!u) return false;
  return u.role === "admin" || String(shipment.userId) === String(u.id);
}

// Admin can edit/delete any shipment.
// A user can edit/cancel only their own shipment, and only while it is still Pending.
export function canModify(shipment) {
  const u = getUser();
  if (!u) return false;
  if (u.role === "admin") return true;
  return String(shipment.userId) === String(u.id) && shipment.status === "Pending";
}

export function newTrackingId() {
  return "TRK" + Math.floor(10000 + Math.random() * 90000);
}
