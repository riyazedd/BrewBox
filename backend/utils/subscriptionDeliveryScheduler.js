import Order from "../models/orderModel.js";

export const checkAndUpdateSubscriptionDeliveries = async () => {
  try {
    const orders = await Order.find({ isDelivered: true }).populate('orderItems.product', 'category name');
    const now = new Date();

    for (const order of orders) {
      const isSubscription = order.orderItems.some(
        (item) => item.product && item.product.category === 'Subscription'
      );
      if (!isSubscription) continue;

      const subItem = order.orderItems.find(
        (item) => item.product && item.product.category === 'Subscription'
      );

      let duration = 3; // default to 3 months
      if (subItem && typeof subItem.product.name === 'string') {
        const match = subItem.product.name.match(/(\d+)\s*months?/i);
        if (match) duration = parseInt(match[1], 10);
      }

      const start = new Date(order.createdAt);
      const end = new Date(start);
      end.setMonth(end.getMonth() + duration);

      // Calculate next monthly delivery after 'start'
		// If subscription already ended, return '-'
		if (now >= end) return "-";
		// Find the next delivery date after now, but before end
		let next = new Date(start);
		while (next <= now && next < end) {
			next.setMonth(next.getMonth() + 1);
		}
		
      if (next > end) next = new Date(end);

      const daysUntilNextDelivery = (next - now) / (1000 * 60 * 60 * 24);

    //   console.log(`Order ${order._id}: Next delivery on ${next.toISOString().substring(0, 10)}, Days until next: ${daysUntilNextDelivery}`);

      // If deliveredAt exists and is within 3 days before next delivery, skip updating isDelivered
      if (order.deliveredAt) {
        const deliveredAtDate = new Date(order.deliveredAt);
        const daysBetweenDeliveredAndNext = (next - deliveredAtDate) / (1000 * 60 * 60 * 24);
        if (daysBetweenDeliveredAndNext >= 0 && daysBetweenDeliveredAndNext <= 3) {
          // Within 3 days window, do not set isDelivered to false
          continue;
        }
      }

      if (daysUntilNextDelivery > 0 && daysUntilNextDelivery <= 3 && next <= end) {
        order.isDelivered = false;
        await order.save();
        console.log(`Order ${order._id} updated: isDelivered set to false`);
      }
    }
  } catch (err) {
    console.error('Error in subscription delivery check:', err);
  }
};
