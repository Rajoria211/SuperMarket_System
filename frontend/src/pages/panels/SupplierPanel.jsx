import { useState, useEffect } from "react";
import api from "../../api/api";

export default function SupplierPanel() {
  const [products, setProducts] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  async function fetchProducts() {
    const { data } = await api.get("/products");
    setProducts(data);
  }

  async function fetchSupplies() {
    const { data } = await api.get("/supply/my");
    setSupplies(data);
  }

  useEffect(() => {
    fetchProducts();
    fetchSupplies();
  }, []);

  async function handleSupply(e) {
    e.preventDefault();

    if (!selectedProduct || !quantity) return;

    await api.post("/supply", {
      product: selectedProduct,
      quantitySupplied: Number(quantity),
    });

    setQuantity("");
    fetchProducts();
    fetchSupplies();
  }

  return (
    <div className="container-fluid">
      {/* SUPPLY FORM */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h4 className="fw-semibold mb-3">Supply Product</h4>

        <form onSubmit={handleSupply}>
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label text-muted">Select Product</label>
              <select
                className="form-select"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Current Stock: {p.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label text-muted">Quantity</label>
              <input
                type="number"
                className="form-control"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <button className="btn btn-primary w-100 rounded-pill">
                Supply
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* SUPPLY HISTORY */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h4 className="fw-semibold mb-3">My Supply History</h4>

        {supplies.length === 0 ? (
          <p className="text-muted">No supplies yet</p>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {supplies.map((s) => (
                <tr key={s._id}>
                  <td className="fw-medium">{s.product?.name}</td>
                  <td>
                    <span className="badge bg-success">
                      +{s.quantitySupplied}
                    </span>
                  </td>
                  <td className="text-muted">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
