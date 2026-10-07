import { useEffect, useState } from "react";
import api from "../Services/api";
import { getUser } from "../Services/auth";

// One form used by both "Add shipment" and "Edit shipment".
// Admin  : can set tracking ID, status, and assign the shipment to any customer.
// User   : status is always Pending on booking and cannot be changed by the user.
function ShipmentForm({ title, initial, submitLabel, onSubmit }) {
  const user = getUser();
  const admin = user.role === "admin";
  const [formData, setFormData] = useState(initial);
  const [customers, setCustomers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (admin) {
      api.get("/users").then((res) => setCustomers(res.data)).catch(console.log);
    }
  }, [admin]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let owner = { userId: formData.userId, createdBy: formData.createdBy };
      if (admin && formData.userId) {
        const c = customers.find((x) => String(x.id) === String(formData.userId));
        if (c) owner = { userId: c.id, createdBy: c.name };
      }
      await onSubmit({
        ...formData,
        ...owner,
        weight: Number(formData.weight),
        price: Number(formData.price),
      });
    } catch (err) {
      console.log(err);
      setError("Could not save the shipment. Please try again.");
      setSaving(false);
    }
  }

  const field = (name, placeholder, type = "text", extra = {}) => (
    <input type={type} name={name} placeholder={placeholder} value={formData[name]}
           onChange={handleChange} required {...extra} />
  );

  return (
    <div className="form-container">
      <h2>{title}</h2>

      <form onSubmit={handleSubmit}>
        {field("trackingId", "Tracking ID", "text", { readOnly: !admin })}
        {field("sender", "Sender Name")}
        {field("receiver", "Receiver Name")}
        {field("origin", "Origin city")}
        {field("destination", "Destination city")}
        {field("courier", "Courier Name (e.g. DTDC)")}

        {admin ? (
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        ) : (
          <input value={`Status: ${formData.status}`} readOnly disabled />
        )}

        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="Normal">Normal priority</option>
          <option value="High">High priority</option>
        </select>

        {field("weight", "Weight in kg", "number", { min: 0.1, step: "any" })}
        {field("price", "Price (₹)", "number", { min: 0 })}
        {field("date", "", "date")}

        {admin && (
          <select name="userId" value={formData.userId || ""} onChange={handleChange} required>
            <option value="" disabled>Assign to customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.role === "admin" ? "admin" : "user"}) – {c.email}
              </option>
            ))}
          </select>
        )}

        {error && <p className="error full">{error}</p>}

        <button type="submit" className="submit-btn" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </form>
    </div>
  );
}

export default ShipmentForm;
