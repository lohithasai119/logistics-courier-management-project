import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Dashboard from "../pages/dashboard";
import Shipments from "../pages/shipment";
import ShipmentDetails from "../pages/shipmentdetails";
import AddShipment from "../pages/addshipment";
import EditShipment from "../pages/editshipment";
import Track from "../pages/track";
import Users from "../pages/users";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/protectedRoute";

function Layout() {
  return (
    <>
      <Navbar />
      <main className="container"><Outlet /></main>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route path="/track" element={<Track />} />
      </Route>

      {/* Logged-in pages (Admin + User) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/shipments/:id" element={<ShipmentDetails />} />
          <Route path="/add-shipment" element={<AddShipment />} />
          <Route path="/edit-shipment/:id" element={<EditShipment />} />
        </Route>
      </Route>

      {/* Admin-only pages */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<Layout />}>
          <Route path="/users" element={<Users />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
