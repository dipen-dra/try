// src/AppRouter.jsx

import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider"; // Adjust path if 


// Import Layouts
import UserLayout from "../layouts/user/UserLayout"; // <-- Import the new layout
import AdminMainLayout from "../layouts/admin/adminMainLayout";

// Import Pages & Components
import Homepage from "../pages/Homepage";
import { LoginPage } from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DonationPage from "../pages/DonationPage";
import DonationSuccessPage from "../pages/DonationSuccessPage";
import DonationFailurePage from "../pages/DonationFailurePage";
import NotificationsPage from "../pages/user/NotificationsPage";

// User Components
import UserDashboard from "../components/user/UserDashboard";
import MyRequest from "../components/user/MyRequest";
import UserMessage from "../components/user/UserMessage";
import MentalHealth from "../components/user/MentalHealth";
import SettingsPage from "../components/user/SettingsPage";
import NotFoundPage from "../components/notFoundPage";

// Admin Pages
import AdminDashboardManagement from "../pages/admin/AdminDashboardManagement";
import UserManagement from "../pages/admin/UserManagement";
import RequestManagement from "../pages/admin/RequestManagement";
import MessageAdmin from "../pages/admin/MessageAdmin";
import DonationsManagement from "../pages/admin/DonationsManagement";

// Protected Route HOC
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>; // Or a loading spinner
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const AppRouter = () => (
  <Routes>
    {/* --- Public Routes --- */}
    <Route path="/" element={<Homepage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/donate/:campaignId" element={<DonationPage />} />
    <Route path="/donation/success" element={<DonationSuccessPage />} />
    <Route path="/donation/failure" element={<DonationFailurePage />} />

    {/* --- User Routes (Nested under the new UserLayout) --- */}
    <Route
      path="/user"
      element={
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<UserDashboard />} />
      <Route path="requests" element={<MyRequest />} /> {/* Path changed to match sidebar */}
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="message" element={<UserMessage />} />
      <Route path="mental-health" element={<MentalHealth />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>

    {/* --- Admin Routes (nested inside a layout) --- */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminMainLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminDashboardManagement />} />
      <Route path="user" element={<UserManagement />} />
      <Route path="request" element={<RequestManagement />} />
      <Route path="message" element={<MessageAdmin />} />
      <Route path="donations" element={<DonationsManagement />} />
    </Route>

    {/* --- Fallback Route for 404 --- */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;