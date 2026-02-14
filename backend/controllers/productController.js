const Product = require("../models/product");

// CREATE PRODUCT (Manager)
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, quantity, supplier } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      quantity,
      supplier,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS (All logged-in users)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("supplier", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT (Manager)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, category, price, quantity } = req.body;

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price ?? product.price;
    product.quantity = quantity ?? product.quantity;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT (Manager)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
