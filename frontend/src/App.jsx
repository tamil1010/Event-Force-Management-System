import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import ForceList from './pages/ForceList';
import AssignmentsPage from './pages/AssignmentsPage';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './components/LoadingSpinner';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to user's authorized home
    if (user?.role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
    if (user?.role === 'Event Manager') return <Navigate to="/dashboard/manager" replace />;
    return <Navigate to="/dashboard/staff" replace />;
  }

  return children;
};

const App = () => {
  const { user, isAuthenticated } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'Admin') return '/dashboard/admin';
    if (user?.role === 'Event Manager') return '/dashboard/manager';
    return '/dashboard/staff';
  };

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={getDefaultRoute()} replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={getDefaultRoute()} replace />} />

      {/* Authenticated Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={getDefaultRoute()} replace />} />
        
        <Route
          path="dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/manager"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Event Manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/staff"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Event Manager', 'Staff/Force Member']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="events" element={<EventsList />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route
          path="force-members"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Event Manager']}>
              <ForceList />
            </ProtectedRoute>
          }
        />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

export default App;
