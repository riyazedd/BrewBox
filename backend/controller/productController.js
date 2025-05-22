import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import fs from 'fs';
import path from 'path';
// import dotenv from 'dotenv';
// dotenv.config();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  
  

  const keyword = req.query.keyword
    ? {
        product_name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  // const count = await Product.countDocuments();
  // const products = await Product.find({})
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    product_name,
    min_price,
    max_price,
    image,
    category,
    countInStock,
    description,
  } = req.body;

  if (!Array.isArray(image) || image.length === 0) {
    res.status(400);
    throw new Error("At least one image is required");
  }

  const product = new Product({
    product_name,
    min_price,
    max_price,
    image, 
    category,
    countInStock,
    description,
    numReviews: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});



// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { product_name, min_price, max_price, description, image, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.product_name = product_name;
    product.min_price = min_price;
    product.max_price = max_price;
    product.description = description;

    // Ensure image is always an array and not empty
    if (!Array.isArray(image) || image.length === 0) {
      res.status(400);
      throw new Error("At least one image is required");
    }
    product.image = image;

    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Delete images from uploads folder
    if (product.image && Array.isArray(product.image)) {
      product.image.forEach(imgPath => {
        // Remove leading slash if present
        const relativePath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        const filePath = path.join(process.cwd(), relativePath);
        fs.unlink(filePath, err => {
          // Log error but don't throw, so product deletion continues
          if (err && err.code !== 'ENOENT') {
            console.error(`Failed to delete image: ${filePath}`, err);
          }
        });
      });
    }

    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Product already reviewed' });
      return;
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);

  res.json(products);
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
