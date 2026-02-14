const Supply = require("../models/supply");
const Product = require("../models/product");

//SUPPLY STOCK (supplier)
exports.createSupply = async (req, res) => {
  try {
    const { product, quantitySupplied } = req.body;

    if (!product || !quantitySupplied) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    //INCREASE STOCK
    existingProduct.quantity += quantitySupplied;
    await existingProduct.save();

    //create supply record
    const supply = await Supply.create({
      supplier: req.user._id,
      product,
      quantitySupplied,
    });

    res.status(201).json(supply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET MY SUPPLIES (supplier)
exports.getMySupplies = async (req, res) => {
  try {
    const supplies = await Supply.find({ supplier: req.user._id })
      .populate("product", "name category")
      .sort({ createdAt: -1 });
    res.json(supplies);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//GET All SUPPLIES (manager)
exports.getAllSupplies = async (req, res) => {
  try {
    const supplies = await Supply.find()
      .populate("supplier", "name email")
      .populate("product", "name category")
      .sort({ createdAt: -1 });

    res.json(supplies);
  } catch (error) {
    res.json({ message: error.message });
  }
};
