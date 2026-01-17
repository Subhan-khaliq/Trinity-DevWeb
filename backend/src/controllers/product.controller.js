import Product from "../models/Product.js";

// Fetch data from Open Food Facts
const fetchOpenFoodFactsData = async (barcode) => {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();
    if (data.status === 1) {
      return data.product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching from OFF:", error);
    return null;
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // If no pagination requested, return all
    if (!page && !limit) {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json({
        products,
        currentPage: 1,
        totalPages: 1,
        totalProducts: products.length
      });
    }

    const skip = ((page || 1) - 1) * (limit || 12);
    const finalLimit = limit || 12;

    const total = await Product.countDocuments();
    const products = await Product.find()
      .skip(skip)
      .limit(finalLimit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      currentPage: page || 1,
      totalPages: Math.ceil(total / finalLimit),
      totalProducts: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const syncWithOpenFoodFacts = async (req, res) => {
  const { barcode } = req.body;
  if (!barcode) return res.status(400).json({ message: "Barcode is required" });

  try {
    const offData = await fetchOpenFoodFactsData(barcode);
    if (!offData) return res.status(404).json({ message: "Product not found on Open Food Facts" });

    // Map OFF data to our model
    const updateData = {
      name: offData.product_name,
      brand: offData.brands,
      picture: offData.image_url,
      category: offData.categories,
      nutritionalInformation: offData.nutriments,
      openFoodFactsData: offData,
      lastUpdatedFromAPI: new Date()
    };

    let product = await Product.findOne({ barcode });
    if (product) {
      product = await Product.findOneAndUpdate({ barcode }, updateData, { new: true });
    } else {
      // Create new
      product = await Product.create({ ...updateData, barcode, price: 0 }); // Price 0 as OFF doesn't have price
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
