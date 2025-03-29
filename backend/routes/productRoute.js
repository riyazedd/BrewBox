import express from "express";
const router = express.Router();
// import products from '../data/product.js'
import Product from "../models/productModel.js";

router.get("/", async (req, res) => {
	const products = await Product.find({});
	res.json(products);
});

router.get("/:id", async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		return res.json(product);
	}

	return res.status(404).json({ message: "Product not found" });
});

export default router;
