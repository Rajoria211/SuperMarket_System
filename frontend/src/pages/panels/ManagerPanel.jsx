import { useState, useEffect } from "react";
import api from "../../api/api";

export default function ManagerPanel() {
  //state variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [total, setTotal] = useState(null);
  const [lowStock, setLowStock] = useState([]);

  async function fetchProducts() {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchReports() {
    const dailyData = await api.get("/reports/daily");
    const monthlyData = await api.get("/reports/monthly");
    const totalData = await api.get("/reports/total");
    const lowStockData = await api.get("/reports/lowStock");

    setDaily(dailyData.data);
    setMonthly(monthlyData.data);
    setTotal(totalData.data);
    setLowStock(lowStockData.data);
  }

  useEffect(() => {
    fetchProducts();
    fetchReports();
  }, []);

  async function handleAddProduct(formData) {
    const name = formData.get("name");
    const category = formData.get("category");
    const price = formData.get("price");
    const quantity = formData.get("quantity");

    if (!name || !category) return;

    const matchingItem = products.find((p) => {
      return p.name === name && p.category === category ? p._id : null;
    });
    console.log(matchingItem._id);

    if (!matchingItem) {
      if (!name || !category || !price || !quantity) {
        return;
      }
      try {
        setLoading(true);
        await api.post("/products", {
          name: name,
          category: category,
          price: Number(price),
          quantity: Number(quantity),
        });

        fetchProducts();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await api.put(`products/${matchingItem._id}`, {
          name: name,
          category: category,
          price: Number(price),
          quantity: Number(quantity),
        });
        fetchProducts();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }

  function ReportCard({ title, data }) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
        <h6 className="text-muted mb-2">{title}</h6>
        <h4 className="fw-bold text-success">₹{data?.totalRevenue || 0}</h4>
        <p className="text-muted mb-0">Orders: {data?.totalOrders || 0}</p>
      </div>
    );
  }
  return (
    <div>
      {/* PRODUCT MANAGEMENT */}
      <div className="card p-4 shadow mb-4">
        <h4>Add Product / Update Product</h4>

        <form action={handleAddProduct}>
          <div className="row">
            <div className="col">
              <input
                name="name"
                className="form-control mb-2"
                placeholder="Product Name"
              />
            </div>

            <div className="col">
              <input
                name="category"
                className="form-control mb-2"
                placeholder="Category"
              />
            </div>

            <div className="col">
              <input
                name="price"
                type="number"
                className="form-control mb-2"
                placeholder="Price"
              />
            </div>

            <div className="col">
              <input
                name="quantity"
                type="number"
                className="form-control mb-2"
                placeholder="Quantity"
              />
            </div>

            <div className="col">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="card p-4 mb-4 shadow">
        <h4>Product List</h4>

        <table className="table mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LOW STOCK */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="fw-semibold text-danger">Low Stock Products</h5>

        {lowStock.length === 0 ? (
          <p>No low stock items</p>
        ) : (
          <ul>
            {lowStock.map((p) => (
              <li key={p._id}>
                {p.name} — Remaining: {p.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* REPORTS SECTION */}
      <div className="row g-4 mb-4">
        <ReportCard title="Daily Sales" data={daily} />
        <ReportCard title="Monthly Sales" data={monthly} />
        <ReportCard title="Total Sales" data={total} />
      </div>
    </div>
  );
}
