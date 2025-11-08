import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../../app/hook";
import { selectIsAuthenticated, selectUser } from "./authSelectors";

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
