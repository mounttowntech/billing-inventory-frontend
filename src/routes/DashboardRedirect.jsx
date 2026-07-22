import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getDashboardRoute } from "../utils/getDashboardRoute";

export default function DashboardRedirect() {
  const { user } = useSelector((state) => state.auth);

  return <Navigate to={getDashboardRoute(user?.role?.roleName)} replace />;
}
