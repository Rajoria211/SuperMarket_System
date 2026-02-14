const Order = require("../models/order");
const product = require("../models/product");
const Product = require("../models/product");

//CREATE ORDER (clerk)
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.json({ message: "No items in order" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        return res.json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      //REDUCE STOCK
      product.quantity -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtThatTime: product.price,
      });
    }

    const order = await Order.create({
      clerk: req.user._id,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET MY ORDERS (clerk)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ clerk: req.user._id })
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//GET ALL ORDERS (Manager)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("clerk", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//DELETE ORDER (clerk - own order only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //check ownership
    if (order.clerk.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own orders",
      });
    }

    //Restore stock
    for (let item of order.items) {
      const product = await Product.findById(item.product);

      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    await order.deleteOne();

    res.json({ message: "Order deleted and Stock restored" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
