import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import PropertyDetail from "./components/PropertyDetails/PropertyDetails";
import { CEOProtectedRoute } from "./features/auth/CEOProtectedRoute";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import AddProperty from "./pages/AddProperty/AddProperty";
import Agents from "./pages/Agents/Agents";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditLead from "./pages/EditLead/EditLead";
import EditProperty from "./pages/EditProperty/EditProperty";
import Leads from "./pages/Leads/Leads";
import LoginPage from "./pages/Login/LoginPage";
import Properties from "./pages/Properties/Properties";
import RegisterPage from "./pages/Register/RegisterPage";
import Requests from "./pages/Requests/Requests";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id/edit" element={<EditLead />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/add" element={<AddProperty />} />
            <Route path="/properties/:sku" element={<PropertyDetail />} />
            <Route path="/properties/edit/:id" element={<EditProperty />} />
            <Route path="/requests" element={<Requests />} />
            <Route element={<CEOProtectedRoute />}>
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
