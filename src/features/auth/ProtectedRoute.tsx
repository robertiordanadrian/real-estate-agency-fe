import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "./authSelectors";
import { useAppSelector } from "../../app/hook";

export const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
