const Order = require("../models/order");
const Product = require("../models/product");

exports.getDailySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    res.json(sales[0] || { totalRevenue: 0, totalOrders: 0 });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//MONTHLY SALES
exports.getMonthlySales = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    res.json(sales[0] || { totalRevenue: 0, totalOrders: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//TOTAL REVENUE (ALL TIME)
exports.getTotalRevenue = async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    res.json(revenue[0] || { totalOrders: 0, totalRevenue: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//LOW STOCK PRODUCTS
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = 10;

    const products = await Product.find({
      quantity: { $lte: threshold },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
