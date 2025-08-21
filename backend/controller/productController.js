import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import natural from "natural";

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(natural.stopwords);
const analyzer = new natural.SentimentAnalyzer(
	"English",
	natural.PorterStemmer,
	"afinn"
);

// Utility: Compute sentiment score from a comment
function analyzeSentiment(comment) {
	const tokens = tokenizer.tokenize(comment ? comment.toLowerCase() : "");
	const filtered = tokens.filter((word) => !stopwords.has(word));
	return analyzer.getSentiment(filtered);
}

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
					$options: "i",
				},
		  }
		: {};

	const count = await Product.countDocuments({ ...keyword });

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
		res.json(product);
	} else {
		res.status(404);
		throw new Error("Product not found");
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
	const {
		product_name,
		min_price,
		max_price,
		description,
		image,
		category,
		countInStock,
	} = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		product.product_name = product_name;
		product.min_price = min_price;
		product.max_price = max_price;
		product.description = description;

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
		res.status(404);
		throw new Error("Product not found");
	}
});

import fs from "fs";
import path from "path";

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		if (product.image && Array.isArray(product.image)) {
			product.image.forEach((imgPath) => {
				const relativePath = imgPath.startsWith("/")
					? imgPath.slice(1)
					: imgPath;
				const filePath = path.join(process.cwd(), relativePath);
				fs.unlink(filePath, (err) => {
					if (err && err.code !== "ENOENT") {
						console.error(`Failed to delete image: ${filePath}`, err);
					}
				});
			});
		}

		await Product.deleteOne({ _id: product._id });
		res.json({ message: "Product removed" });
	} else {
		res.status(404);
		throw new Error("Product not found");
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
			res.status(400);
			throw new Error("Product already reviewed");
		}

		const sentimentScore = analyzeSentiment(comment);

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			sentimentScore,
			user: req.user._id,
		};

		product.reviews.push(review);
		product.numReviews = product.reviews.length;
		product.rating =
			product.reviews.reduce((acc, item) => item.rating + acc, 0) /
			product.reviews.length;

		await product.save();
		res.status(201).json({ message: "Review added" });
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(4);
	res.json(products);
});

// @desc    Get recommended products based on sentiment analysis
// @route   GET /api/products/recommend/:userId
// @access  Public
const getRecommendedProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).lean();

	// Prepare TF-IDF
	const TfIdf = natural.TfIdf;
	const tfidf = new TfIdf();
	const docs = products.map(
		(p) => (p.product_name || "") + " " + (p.description || "")
	);
	docs.forEach((doc) => tfidf.addDocument(doc));

	// Only include products with at least 1 review
	const productSentiments = products
		.map((product, i) => {
			const sentimentSum = product.reviews.reduce(
				(sum, review) =>
					sum + (review.sentimentScore || analyzeSentiment(review.comment)),
				0
			);
			const avgSentiment =
				product.reviews.length > 0 ? sentimentSum / product.reviews.length : 0;

			// TF-IDF: sum all tf-idf values for this doc (as a proxy for content richness)
			let tfidfScore = 0;
			const terms = docs[i].split(/\s+/);
			terms.forEach((term) => {
				tfidfScore += tfidf.tfidf(term, i);
			});

			// Use rating and sentiment for sorting
			const avgRating =
				product.reviews.length > 0
					? product.reviews.reduce((acc, item) => acc + item.rating, 0) /
					  product.reviews.length
					: 0;
			// You can adjust the weights as needed
			// Prioritize avgRating, then avgSentiment, then tfidfScore
			const combinedScore = avgRating * 10000 + avgSentiment * 100 + tfidfScore;
      console.log("TF-IDF Score: ",tfidfScore);
			return { ...product, avgRating, avgSentiment, tfidfScore, combinedScore };
		})
		.filter((p) => p.numReviews > 0);

	// Sort by combinedScore (rating prioritized, then sentiment, then tf-idf)
	productSentiments.sort((a, b) => b.combinedScore - a.combinedScore);
	const recommended = productSentiments.slice(0, 4);
	res.json(recommended);
});

export {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	createProductReview,
	getTopProducts,
	getRecommendedProducts,
};
