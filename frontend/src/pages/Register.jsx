import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setError("");
    setLoading(true);
    try {
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const role = formData.get("role");

      if (!name || !email || !password) {
        setLoading(false);
        return setError("All fields are required");
      }

      if (password.length < 6) {
        setLoading(false);
        return setError("Password must be at least 6 characters");
      }

      setLoading(true);

      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
          <p className="text-muted mb-0">Create Your Account</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form action={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted">Name</label>
            <input
              name="name"
              placeholder="Name"
              className="form-control mb-3"
            />
          </div>

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
          <div className="mb-3">
            <label className="form-label text-muted">Role</label>
            <select name="role" className="form-control mb-3">
              <option value="clerk">Clerk</option>
              <option value="manager">Manager</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>
          <button
            className="btn btn-primary w-100 rounded-pill mt-2"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
