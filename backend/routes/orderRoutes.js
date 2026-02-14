const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  deleteOrder,
} = require("../controllers/orderController");

const { protect } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

//Clerk creates order
router.post("/", protect, roleMiddleware("clerk"), createOrder);

//Clerk sees own orders
router.get("/my", protect, roleMiddleware("clerk"), getMyOrders);

//Clerk deletes orders
router.delete("/:id", protect, roleMiddleware("clerk"), deleteOrder);

//Manager sees all orders
router.get("/", protect, roleMiddleware("manager"), getAllOrders);

module.exports = router;
