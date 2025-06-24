import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;


  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Get product IDs from orderItems (_id or product)
  const productIds = orderItems.map((x) => x.product || x._id);

  const itemsFromDB = await Product.find({
    _id: { $in: productIds },
  });

  // Prepare order items with DB data
  const dbOrderItems = orderItems.map((itemFromClient) => {
    const productId = itemFromClient.product || itemFromClient._id;

    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === productId
    );

    if (!matchingItemFromDB) {
      throw new Error(`Product not found: ${productId}`);
    }

    return {
      name: matchingItemFromDB.product_name,
      qty: itemFromClient.qty || itemFromClient.quantity,
      image: Array.isArray(matchingItemFromDB.image)
        ? matchingItemFromDB.image[0]
        : matchingItemFromDB.image,
      price: itemFromClient.price,
      product: matchingItemFromDB._id,
      size: itemFromClient.size, // Pass size from client
      grind: itemFromClient.grind, // Pass grind from client
      roast: itemFromClient.roast
    };
  });

  // Create and save order
  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'category');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('orderItems.product', 'category name');

  if (order) {
    // Check if any item is a subscription
    const isSubscription = order.orderItems.some(
      (item) => item.product && item.product.category === 'Subscription'
    );

    if (!isSubscription) {
      // For coffee or other categories, keep the original logic
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    }

    // For subscription, mark as delivered now
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();

    // Calculate next delivery date
    const createdAt = order.createdAt;
    // Extract duration from product name (e.g., '3 Months Subscription')
    const subItem = order.orderItems.find(
      (item) => item.product && item.product.category === 'Subscription'
    );
    let duration = 3;
    if (subItem && typeof subItem.product.name === 'string') {
      const match = subItem.product.name.match(/(\d+)\s*months?/i);
      if (match) duration = parseInt(match[1], 10);
    }
    // Find the next delivery date after now, but before end
    const now = new Date();
    const start = new Date(createdAt);
    const end = new Date(start);
    end.setMonth(end.getMonth() + duration);
    let next = new Date(start);
    while (next <= now && next < end) {
      next.setMonth(next.getMonth() + 1);
    }
    // If next delivery is within 3 day, set isDelivered to false
    const msInDay = 3 * 24 * 60 * 60 * 1000;
    if (next - now <= msInDay && next > now && next <= end) {
      order.isDelivered = false;
      await order.save();
    }

    return res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  .populate('orderItems.product', 'category');
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getOrders,
};
