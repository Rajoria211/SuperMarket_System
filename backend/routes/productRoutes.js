const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

// Manager-only routes
router.post("/", protect, roleMiddleware("manager"), createProduct);
router.put("/:id", protect, roleMiddleware("manager"), updateProduct);
router.delete("/:id", protect, roleMiddleware("manager"), deleteProduct);

// All logged-in users
router.get("/", protect, getProducts);

module.exports = router;
