import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <span
        className="navbar-brand fw-bold"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        🏪 ABCD Supermarket
      </span>

      {user && (
        <div className="ms-auto d-flex align-items-center gap-3 text-white">
          <span className="fw-medium">
            {user.name} ({user.role})
          </span>

          <button
            className="btn btn-sm btn-danger rounded-pill"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
