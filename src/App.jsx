// src/App.jsx
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import ProfileDetail from "./pages/ProfileDetail";
import Search from "./pages/Search";
import Account from "./pages/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import { useEffect } from "react";
import { fetchCSRFToken } from "./utils/csrf";

function App() {
  useEffect(() => {
    fetchCSRFToken().catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <MainLayout><Profiles /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profiles/:id"
          element={
            <ProtectedRoute>
              <MainLayout><ProfileDetail /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <MainLayout><Search /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <MainLayout><Account /></MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;