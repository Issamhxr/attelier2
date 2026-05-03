import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import ParentDashboard from "./pages/parent/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import SecretaireDashboard from "./pages/secretaire/SecretaireDashboard";

function PrivateRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (role !== allowedRole) return <Navigate to="/login" />;
  return children;
}

// ✅ Wrapper pour passer onLoginClick à Home
function HomeWrapper() {
  const navigate = useNavigate();
  return <Home onLoginClick={() => navigate("/login")} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeWrapper />} />

        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={
          <PrivateRoute allowedRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        } />

        <Route path="/parent" element={
          <PrivateRoute allowedRole="parent">
            <ParentDashboard />
          </PrivateRoute>
        } />

        <Route path="/professeur" element={
          <PrivateRoute allowedRole="professeur">
            <TeacherDashboard />
          </PrivateRoute>
        } />

        <Route path="/etudiant" element={
          <PrivateRoute allowedRole="etudiant">
            <StudentDashboard />
          </PrivateRoute>
        } />

        <Route path="/secretaire" element={
          <PrivateRoute allowedRole="secretaire">
            <SecretaireDashboard />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}