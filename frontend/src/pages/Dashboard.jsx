import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import BoardList from "../components/BoardList";
import CreateBoard from "../components/CreateBoard";

function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="container py-4 py-md-5 page-shell">
      {/* Hero Section */}
      <div className="page-hero mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <div className="badge text-bg-light text-dark mb-3">
              Dashboard
            </div>

            <h1 className="display-6 mb-2">
              Task Management Board
            </h1>

            <p
              className="mb-0"
              style={{ color: "rgba(255,255,255,.8)" }}
            >
              Boards, tasks, and team progress in one place.
            </p>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {isAdmin && (
              <>
                <button
                  className="btn btn-light"
                  onClick={() => navigate("/admin/users")}
                >
                  Manage Users
                </button>

                <button
                  className="btn btn-light"
                  onClick={() => navigate("/admin/boards")}
                >
                  Manage Boards
                </button>
              </>
            )}

            <button
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1">
            Welcome, {user?.name || "User"}
          </h2>

          <div className="page-muted">
            {user?.email}
          </div>

          <div className="page-muted">
            Role: {isAdmin ? "Admin" : "Member"}
          </div>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Boards</h6>
              <h2 className="mb-0">--</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Tasks</h6>
              <h2 className="mb-0">--</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Completed</h6>
              <h2 className="mb-0">--</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h6 className="text-muted">Pending</h6>
              <h2 className="mb-0">--</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Create Board */}
      {isAdmin && (
        <div className="mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">Create New Board</h5>
              <CreateBoard onBoardCreated={() => {}} />
            </div>
          </div>
        </div>
      )}

      {/* Board List */}
      <BoardList />
    </div>
  );
}

export default Dashboard;