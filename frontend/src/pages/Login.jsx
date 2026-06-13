import { useState } from "react";
import {
  useNavigate,
  Navigate,
  Link,
} from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      login(res.data.data);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div
        className="container"
        style={{ maxWidth: 1100 }}
      >
        <div className="card login-card shadow border-0">
          <div className="row g-0">

            {/* Left Side */}
            <div className="col-12 col-lg-4 login-intro">
              <div className="h-100 d-flex flex-column justify-content-between gap-4">

                <div>
                  <span className="badge text-bg-light text-dark mb-3">
                    Task Board
                  </span>

                  <h1 className="mb-3">
                    Work that looks organized before the sprint even starts.
                  </h1>

                  <p
                    className="mb-0"
                    style={{
                      color:
                        "rgba(255,255,255,.8)",
                    }}
                  >
                    Sign in to manage boards,
                    tasks, and team collaboration
                    in one focused workspace.
                  </p>
                </div>

                <div className="d-flex gap-4 flex-wrap">
                  <div>
                    <div className="h4 mb-0">
                      Boards
                    </div>
                    <small
                      style={{
                        color:
                          "rgba(255,255,255,.75)",
                      }}
                    >
                      Track work by team
                    </small>
                  </div>

                  <div>
                    <div className="h4 mb-0">
                      Tasks
                    </div>
                    <small
                      style={{
                        color:
                          "rgba(255,255,255,.75)",
                      }}
                    >
                      Move work across stages
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="col-12 col-lg-8 login-form-pane">
              <h2 className="h3 mb-2">
                Welcome Back
              </h2>

              <p className="page-muted mb-4">
                Login to continue managing your projects.
              </p>

              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="d-grid gap-3"
              >
                <input
                  className="form-control"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

                <div className="input-group">
                  <input
                    className="form-control"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>

                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Signing In..."
                    : "Login"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <span className="text-muted">
                  Don't have an account?{" "}
                </span>

                <Link to="/register">
                  Create one
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;