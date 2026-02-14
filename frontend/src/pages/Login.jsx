import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    try {
      const email = formData.get("email");
      const password = formData.get("password");

      if (!email || !password) {
        setLoading(false);
        return setError("All fields are required");
      }

      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card border-0 shadow-lg rounded-4 p-5"
        style={{ width: "420px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">🏪 ABCD Supermarket</h2>
          <p className="text-muted mb-0">Management System Login</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form action={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-3"
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-3"
            />
          </div>

          <button
            className="btn btn-primary w-100 rounded-pill mt-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-3 text-center">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
