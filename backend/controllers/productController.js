import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// NOTE:
// @desc            fetch all products
// @route           GET /api/products
// @access          Public
// asyncHandler:    allows us to avoid using try/catch block for async functions (async functions returns a promise).
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .sort({ createdAt: "desc" })
    .limit(pageSize)
    .skip(pageSize * (page - 1)); // minus 1 means: except the one page we are on, exclude every page we do not want.
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// NOTE:
// @desc        fetch a product
// @route       GET /api/products/:id
// @access      Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// NOTE:
// @desc            create a product
// @route           POST /api/products
// @access          Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "New Product",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Product Brand",
    category: "Product Category",
    countInStock: 0,
    numReviews: 0,
    description: "Product Description",
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc            update a products
// @route           PUT /api/products/:id
// @access          Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    if (
      product.name === "Amazon Echo Dot 3rd Generation" ||
      product.name === "Cannon EOS 80D DSLR Camera" ||
      product.name === "Sony Playstation 4 Pro White Version" ||
      product.name === "Logitech G-Series Gaming Mouse" ||
      product.name === "Airpods Wireless Bluetooth Headphones" ||
      product.name === "iPhone 11 Pro 256GB Memory"
    ) {
      res.status(400);
      throw new Error("Can't edit test product");
    }
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(200).json({ message: "Product updated", updatedProduct });
  } else {
    res.status("404");
    throw new Error("Resource not found");
  }
});

// @desc            delete a products
// @route           DELETE /api/products/:id
// @access          Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // console.log(product.name);

  if (product) {
    // ifelse statement to be removed in deployment

    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status("404");
    throw new Error("Resource not found");
  }
});

// @desc            create a new review
// @route           POST /api/products/:id/reviews
// @access          Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You've already reviewed product");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// NOTE:
// @desc        get top rated product
// @route       GET /api/products/top-products
// @access      Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: "desc" }).limit(3);

  res.status(200).json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
