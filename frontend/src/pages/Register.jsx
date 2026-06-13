import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post(
        "/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        }
      );

      login(res.data.data);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div className="card login-card shadow border-0">
          <div className="row g-0">
            <div className="col-12 col-lg-4 login-intro">
              <div className="h-100 d-flex flex-column justify-content-between gap-4">
                <div>
                  <span className="badge text-bg-light text-dark mb-3">Join the board</span>
                  <h1 className="mb-3">Create an account and get into the workflow.</h1>
                  <p className="mb-0" style={{ color: "rgba(255,255,255,.8)" }}>
                    Set up a user profile, join boards, and keep tasks moving through Todo, In Progress, and Done.
                  </p>
                </div>

                <div className="d-flex gap-3 flex-wrap">
                  <div>
                    <div className="h4 mb-0">Fast</div>
                    <small style={{ color: "rgba(255,255,255,.75)" }}>Simple sign-up flow</small>
                  </div>
                  <div>
                    <div className="h4 mb-0">Clear</div>
                    <small style={{ color: "rgba(255,255,255,.75)" }}>Focused task visibility</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-8 login-form-pane">
              <h2 className="h3 mb-2">Register</h2>
              <p className="page-muted mb-4">Create a user account to join boards.</p>

              {error ? (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="d-grid gap-3">
                <input
                  className="form-control"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <input
                  className="form-control"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <input
                  className="form-control"
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />

                <button className="btn btn-dark" type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Register"}
                </button>
              </form>

              <div className="mt-3 text-center">
                <a href="/login">Already have an account?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;