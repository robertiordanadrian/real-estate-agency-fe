import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Dashboard from "./pages/Dashboard/Dashboard";
import { PrivateRoute } from "./components/PrivateRoute";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import Properties from "./pages/Properties/Properties";
import { AddProperty } from "./pages/AddProperty/AddProperty";
import PropertyDetails from "./components/Properties/PropertyDetails/PropertyDetails";
import { PropertyProvider } from "./context/PropertyContext";
import { setGlobalNavigate } from "./api/axiosClient";
import { useEffect } from "react";
import { EditProperty } from "./pages/EditProperty/EditProperty";

const AppRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route path="properties" element={<Properties />} />
        <Route path="properties/add" element={<AddProperty />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
        <Route path="/properties/edit/:id" element={<EditProperty />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
