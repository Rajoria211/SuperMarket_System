import { useState, useEffect } from "react";
import api from "../../api/api";

export default function ClerkPanel() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  async function fetchProducts() {
    const { data } = await api.get("/products");
    setProducts(data);
  }

  async function fetchOrders() {
    const { data } = await api.get("/orders/my");
    setOrders(data);
  }

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Add to cart
  function addToCart(item) {
    console.log(item);
    const matchItem = cart.find((cartItem) => cartItem._id === item._id);
    if (matchItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } else {
      setCart((prevCart) => {
        return [
          ...prevCart,
          {
            ...item,
            quantity: 1,
          },
        ];
      });
    }
  }

  // Calculate total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  //Increase quantity in cart
  function increaseQty(id) {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  //Decrease quantity in cart
  function decreaseQty(id) {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }
  //Remove from cart
  function removeItem(id) {
    setCart(cart.filter((item) => item._id !== id));
  }
  //Place order
  async function placeOrder() {
    if (cart.length === 0) return;

    await api.post("/orders", {
      items: cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
    });

    setCart([]);
    fetchProducts();
    fetchOrders();
  }

  //Delete order
  async function deleteOrder(id) {
    await api.delete(`/orders/${id}`);
    fetchOrders();
    fetchProducts();
  }

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {/* PRODUCT LIST */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h4 className="fw-semibold mb-3">Products</h4>

            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td className="fw-medium">{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.quantity > 5 ? "bg-success" : "bg-warning text-dark"
                        }`}
                      >
                        {p.quantity}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill"
                        disabled={p.quantity === 0}
                        onClick={() => addToCart(p)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CART */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h4 className="fw-semibold mb-3">Cart</h4>

            {cart.length === 0 ? (
              <p className="text-muted">No items added</p>
            ) : (
              <>
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => decreaseQty(item._id)}
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => increaseQty(item._id)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>₹{item.price * item.quantity}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeItem(item._id)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="d-flex justify-content-between align-items-center">
                  <h5>Total</h5>
                  <h4 className="fw-bold">₹{cartTotal}</h4>
                </div>

                <button
                  className="btn btn-success w-100 mt-3 rounded-pill"
                  onClick={placeOrder}
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ORDER HISTORY */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mt-4">
        <h4 className="fw-semibold mb-3">My Orders</h4>

        {orders.length === 0 ? (
          <p className="text-muted">No orders yet</p>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Total</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="fw-medium">₹{o.totalAmount}</td>
                  <td className="text-muted">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill"
                      onClick={() => deleteOrder(o._id)}
                    >
                      Delete
                    </button>
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
