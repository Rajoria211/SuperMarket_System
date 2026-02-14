import { useNavigate } from "react-router-dom";
import ManagerPanel from "./panels/ManagerPanel";
import ClerkPanel from "./panels/ClerkPanel";
import SupplierPanel from "./panels/SupplierPanel";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="container-fluid px-4 py-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">Welcome, {user.name}</h3>
      </div>

      {user.role === "manager" && <ManagerPanel />}
      {user.role === "clerk" && <ClerkPanel />}
      {user.role === "supplier" && <SupplierPanel />}
    </div>
  );
}
