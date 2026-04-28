// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login              from "./pages/auth/Login";
import AdminDashboard     from "./pages/admin/AdminDashboard";
import TeacherDashboard   from "./pages/Teacher/TeacherDashboard";
import StudentDashboard   from "./pages/student/StudentDashboard";
import SecretaireDashboard from "./pages/secretaire/SecretaireDashboard"; // ✅ Ajoute

function PrivateRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (role !== allowedRole) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={
          <PrivateRoute allowedRole="admin">
            <AdminDashboard />
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

        {/* ✅ Ajoute cette route */}
        <Route path="/secretaire" element={
          <PrivateRoute allowedRole="secretaire">
            <SecretaireDashboard />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}