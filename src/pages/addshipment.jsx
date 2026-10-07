import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import { getUser, newTrackingId } from "../Services/auth";
import ShipmentForm from "../components/ShipmentForm";

function AddShipment() {
  const navigate = useNavigate();
  const user = getUser();

  const initial = {
    trackingId: newTrackingId(), // auto generated
    sender: user.role === "admin" ? "" : user.name,
    receiver: "",
    origin: "",
    destination: "",
    courier: "",
    status: "Pending",
    priority: "Normal",
    weight: "",
    price: "",
    date: new Date().toISOString().slice(0, 10),
    userId: user.role === "admin" ? "" : user.id, // owner of the shipment
    createdBy: user.name,
  };

  async function save(data) {
    // A normal user can never create a shipment in any status other than Pending
    const body = user.role === "admin" ? data : { ...data, status: "Pending", userId: user.id, createdBy: user.name };
    await api.post("/shipments", body);
    navigate("/shipments");
  }

  return (
    <ShipmentForm
      title={user.role === "admin" ? "Add New Shipment" : "Book a Shipment"}
      initial={initial}
      submitLabel={user.role === "admin" ? "Add Shipment" : "Book Shipment"}
      onSubmit={save}
    />
  );
}

export default AddShipment;
