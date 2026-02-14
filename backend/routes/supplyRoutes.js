const express = require("express");
const router = express.Router();

const {
  createSupply,
  getAllSupplies,
  getMySupplies,
} = require("../controllers/supplyController");
const { protect } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");

//supplier add stock
router.post("/", protect, roleMiddleware("supplier"), createSupply);

//supplier sees own supplies
router.get("/my", protect, roleMiddleware("supplier"), getMySupplies);

//manager sees all supplies
router.get("/", protect, roleMiddleware("manager"), getAllSupplies);

module.exports = router;
