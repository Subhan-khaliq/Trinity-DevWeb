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
    const {
      page = 1,
      limit = 12,
      category,
      sort,
      isGlutenFree,
      isVegan,
      isVegetarian
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (isGlutenFree === 'true') query.isGlutenFree = true;
    if (isVegan === 'true') query.isVegan = true;
    if (isVegetarian === 'true') query.isVegetarian = true;

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const finalLimit = parseInt(limit);

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(finalLimit)
      .sort(sortOption);

    res.json({
      products,
      currentPage: parseInt(page),
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
  const { barcode, shouldSave = true } = req.body;
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
      labels: offData.labels_tags || [],
      ingredients: offData.ingredients_text,
      allergens: offData.allergens_tags || [],
      isGlutenFree: offData.labels_tags?.some(tag => tag.includes('gluten-free')) || false,
      isVegan: offData.labels_tags?.some(tag => tag.includes('vegan')) || false,
      isVegetarian: offData.labels_tags?.some(tag => tag.includes('vegetarian')) || false,
      openFoodFactsData: offData,
      lastUpdatedFromAPI: new Date()
    };

    if (!shouldSave) {
      // Just return the mapped data without saving
      return res.json({ ...updateData, barcode });
    }

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
