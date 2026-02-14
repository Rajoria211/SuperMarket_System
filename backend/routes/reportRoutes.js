const express = require("express");
const router = express.Router();

const {
  getDailySales,
  getMonthlySales,
  getTotalRevenue,
  getLowStockProducts,
} = require("../controllers/reportController");

const { protect } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

//Manager only routes
router.get("/daily", protect, roleMiddleware("manager"), getDailySales);
router.get("/monthly", protect, roleMiddleware("manager"), getMonthlySales);
router.get("/total", protect, roleMiddleware("manager"), getTotalRevenue);
router.get(
  "/lowStock",
  protect,
  roleMiddleware("manager"),
  getLowStockProducts,
);

module.exports = router;
