import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Services/api";
import { canModify, canView, getUser } from "../Services/auth";
import ShipmentForm from "../components/ShipmentForm";

function EditShipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/shipments/${id}`)
      .then((res) => {
        if (!canView(res.data)) setError("⛔ Access denied. This shipment belongs to another user.");
        else if (!canModify(res.data)) setError("This shipment can no longer be edited because it is already " + res.data.status + ".");
        else setShipment(res.data);
      })
      .catch(() => setError("Shipment not found."));
  }, [id]);

  async function save(data) {
    // Users cannot change the status or the owner, even if they tamper with the form
    const body = user.role === "admin" ? data : { ...data, status: shipment.status, userId: shipment.userId, createdBy: shipment.createdBy };
    await api.put(`/shipments/${id}`, body);
    navigate("/shipments");
  }

  if (error) return <p className="empty">{error}</p>;
  if (!shipment) return <p className="muted center">Loading...</p>;

  return (
    <ShipmentForm
      title="Edit Shipment"
      initial={shipment}
      submitLabel="Update Shipment"
      onSubmit={save}
    />
  );
}

export default EditShipment;
