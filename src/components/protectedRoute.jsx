import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../Services/auth";

// <ProtectedRoute />            -> any logged-in person (admin or user)
// <ProtectedRoute role="admin"/> -> admin only
function ProtectedRoute({ role }) {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
