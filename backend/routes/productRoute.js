import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getRecommendedProducts, // ✅ import this
} from '../controller/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.get('/recommend/:userId', getRecommendedProducts);
router.get('/top', getTopProducts);
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);
export default router;
