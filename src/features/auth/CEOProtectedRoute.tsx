import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "./authSelectors";
import { useAppSelector } from "../../app/hook";

export const CEOProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "CEO") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
