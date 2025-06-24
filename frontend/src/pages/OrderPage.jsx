import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import Message from '../components/Message';
// import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from '../slices/ordersApiSlice';

const OrderPage = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  // console.log(userInfo)

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
    toast.success('Order marked as delivered');
  };

  return isLoading ? (
    <>Loading...</>
  ) : error ? (
    <>{error.data.message}</>
  ) : (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order {order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">Shipping</h2>
            <p>
              <span className="font-medium">Name:</span> {order.user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span>{' '}
              <a href={`mailto:${order.user.email}`} className="text-blue-600 underline">
                {order.user.email}
              </a>
            </p>
            <p>
              <span className="font-medium">Address:</span>{' '}
              {order.shippingAddress.address}, {order.shippingAddress.city}
            </p>
            {order.isDelivered ? (
              <div className= 'mt-5 p-5 rounded bg-green-200 text-green-900'>Delivered on {order.deliveredAt}</div>
            ) : (
              <div className= 'mt-5 p-5 rounded bg-red-200 text-red-900'>Not Delivered</div>
            )}
          </div>

          {/* Payment Method */}
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
            <p className='flex gap-2'>
              <span className="font-medium ">Method:</span><span className='uppercase'>{order.paymentMethod}</span>
            </p>
            
          </div>

          {/* Order Items */}
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <>Order is empty</>
            ) : (
              <ul className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                   <div className='flex items-center gap-4'>
                     <img
                      src={`${
                        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
                      }${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex gap-2">
                      <Link to={`/product/${item.product}`} className="text-blue-600 underline text-lg">
                        {item.name}
                      </Link>
                      <div className="text-lg text-gray-600 capitalize">
                        {item.product.category === 'Subscription' && (
                          <span className="mr-2 text-green-600">Roast: {item.roast}</span>
                        )}
                        (Size: {item.size}, Grind: {item.grind})
                      </div>
                    </div>
                   </div>
                    <div className="text-lg">
                      {item.qty} x Rs.{item.price} = Rs.{item.qty * item.price}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="p-4 border rounded-lg shadow-sm bg-white space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="flex justify-between">
            <span>Items</span>
            <span>Rs.{order.itemsPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Rs.{order.shippingPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>Rs.{order.taxPrice}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>Rs.{order.totalPrice}</span>
          </div>

          {/* Admin: Mark as Delivered */}
          {loadingDeliver && <>Loading...</>}
          {userInfo &&
            userInfo.isAdmin &&
            !order.isDelivered && (
              <button
                onClick={deliverHandler}
                className="w-full mt-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Mark As Delivered
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
