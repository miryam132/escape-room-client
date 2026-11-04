import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loading } from "../../components/common/Common";
import type { Role } from "../../types/user";
import { useAuth } from "./authContext";

/** Layout route: renders children only for a logged-in user (with the given role, if any). */
export default function RequireRole({ role }: { role?: Role }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/rooms" replace />;
  return <Outlet />;
}
