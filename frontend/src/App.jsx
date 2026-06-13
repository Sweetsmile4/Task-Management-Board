import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BoardView from "./pages/BoardView";
import AdminUsers from "./pages/AdminUsers";
import AdminBoards from "./pages/AdminBoards";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boards/:id" element={<BoardView />} />
        </Route>

        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/boards" element={<AdminBoards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;