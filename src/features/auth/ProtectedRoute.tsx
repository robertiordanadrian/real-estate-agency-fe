import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "@/app/hook";
import { selectIsAuthenticated } from "@/features/auth/authSelectors";

export const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
