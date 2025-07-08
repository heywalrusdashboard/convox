// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/protected/ProtectedRoute";
import ConfigureCompanionPage from "@/pages/ConfigureCompanionPage";
import ReportsPage from "./pages/ReportsPage";
import ChatWidget from "./pages/ChatWidget";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat-widget" element={<ChatWidget/>}/>

        {/* Protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configureCompanion"
          element={
            <ProtectedRoute>
              <ConfigureCompanionPage />
            </ProtectedRoute>
          }
          />
          <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage/>
            </ProtectedRoute>
          }
          />
          <Route
          path="*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          />
      </Routes>
    </Router>
  );
}

export default App;
