import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Properties from "./pages/Properties/Properties";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import PropertyDetail from "./components/PropertyDetails/PropertyDetails";
import Settings from "./pages/Settings/Settings";
import { CEOProtectedRoute } from "./features/auth/CEOProtectedRoute";
import Leads from "./pages/Leads/Leads";
import Agents from "./pages/Agents/Agents";
import FilterProperties from "./pages/FilterProperties/FilterProperties";
import PropertyRequests from "./pages/PropertyRequests/PropertyRequests";
import EditLead from "./pages/EditLead/EditLead";
import LeadRequests from "./pages/LeadRequests/LeadRequests";
import AddProperty from "./pages/AddProperty/AddProperty";
import EditProperty from "./pages/EditProperty/EditProperty";

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
            <Route path="/filter-properties" element={<FilterProperties />} />
            <Route path="/property-requests" element={<PropertyRequests />} />
            <Route path="/lead-requests" element={<LeadRequests />} />
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
