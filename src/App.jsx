// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/protected/ProtectedRoute";
import ConfigureCompanionPage from "@/pages/ConfigureCompanionPage";
import ReportsLayout from "@/pages/reports/ReportsLayout";
import ConversationsReport from "@/pages/reports/ConversationsReport";
import ChatsReport from "@/pages/reports/ChatsReport";
import CustomersReport from "@/pages/reports/CustomersReport";
import InvoicesReport from "@/pages/reports/InvoicesReport";
import UsageReport from "@/pages/reports/UsageReport";
import ChatWidget from "./pages/ChatWidget";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat-widget" element={<ChatWidget />} />

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
              <ReportsLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ConversationsReport />} />
          <Route path="conversations" element={<ConversationsReport />} />
          <Route path="chats" element={<ChatsReport />} />
          <Route path="customers" element={<CustomersReport />} />
          <Route path="invoices" element={<InvoicesReport />} />
          <Route path="usage" element={<UsageReport />} />
        </Route>
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
