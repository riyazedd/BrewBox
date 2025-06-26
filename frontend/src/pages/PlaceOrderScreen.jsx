import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [esewaFormSubmitted, setEsewaFormSubmitted] = useState(false);
  const esewaFormRef = useRef(null);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  // Calculate amounts
  const itemsPrice = cart.itemsPrice;
  const taxPrice = cart.taxPrice;
  const totalPrice = cart.totalPrice;
  // const totalAmount = itemsPrice+taxPrice;
  // console.log(totalPrice, itemsPrice, taxPrice);

  const placeOrderHandler = async () => {
    if (cart.paymentMethod === 'Esewa') {
  const uid = uuidv4();
  const itemsPriceNum = Number(itemsPrice);
  const taxPriceNum = Number(taxPrice);
  const shippingPriceNum = Number(cart.shippingPrice);
  const serviceChargeNum = 0;
  const totalAmountNum = itemsPriceNum + taxPriceNum + serviceChargeNum + shippingPriceNum;

  const itemsPriceStr = itemsPriceNum.toFixed(2);
  const taxPriceStr = taxPriceNum.toFixed(2);
  const shippingPriceStr = shippingPriceNum.toFixed(2);
  const serviceChargeStr = serviceChargeNum.toFixed(2);
  const totalAmountStr = totalAmountNum.toFixed(2);

  const message = `total_amount=${totalAmountStr},transaction_uuid=${uid},product_code=EPAYTEST`;
  const esewaSecret = import.meta.env.VITE_ESEWASECRET;
  const hash = CryptoJS.HmacSHA256(message, esewaSecret);
  const signature = CryptoJS.enc.Base64.stringify(hash);

  // 🔐 Save to localStorage for recovery after redirect
  localStorage.setItem("cartItems", JSON.stringify(cart.cartItems));
  localStorage.setItem("shippingAddress", JSON.stringify(cart.shippingAddress));
  localStorage.setItem("paymentMethod", cart.paymentMethod);
  localStorage.setItem("itemsPrice", itemsPrice);
  localStorage.setItem("shippingPrice", cart.shippingPrice);
  localStorage.setItem("taxPrice", taxPrice);
  localStorage.setItem("totalPrice", totalPrice);

  if (esewaFormRef.current) {
    const form = esewaFormRef.current;
    form.amount.value = itemsPriceStr;
    form.tax_amount.value = taxPriceStr;
    form.total_amount.value = totalAmountStr;
    form.product_service_charge.value = serviceChargeStr;
    form.product_delivery_charge.value = shippingPriceStr;
    form.transaction_uuid.value = uid;
    form.signature.value = signature;

    setEsewaFormSubmitted(true);
    form.submit();
  }
  return;
}


    // Normal order process
    try {
      const res = await createOrder({
        orderItems: cart.cartItems.map(item => ({
          name: item.product_name,
          qty: item.quantity,
          size: item.size,
          grind: item.grind,
          roast: item.roast,
          image: item.image[0],
          price: item.price,
          product: item._id,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Order failed');
    }
  };

  return (
    <div className="px-4 py-6">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Shipping</h2>
            <p>
              <span className="font-semibold">Address:</span>{' '}
              {cart.shippingAddress.address}, {cart.shippingAddress.city}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
            <p>
              <span className="font-semibold">Method:</span>{' '}
              {cart.paymentMethod}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <>Your cart is empty</>
            ) : (
              <ul className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <img
                      src={`${
                        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
                      }${item.image[0]}`}
                      alt={item.product_name}
                      className="w-16 h-16 rounded"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.product_name}
                      </Link>
                      <div className="text-sm text-gray-600 capitalize">
                        Size: {item.size}, Grind: {item.grind}
                        {item.category === 'Subscription' && (
                          <span className="ml-2 text-green-600">Roast: {item.roast}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {item.quantity} x Rs.{item.price} = Rs.{' '}
                      {(item.quantity * item.price).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="flex justify-between border-b pb-2">
            <span>Items</span>
            <span>Rs.{itemsPrice}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Shipping</span>
            <span>Rs.{cart.shippingPrice}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Tax</span>
            <span>Rs.{taxPrice}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rs.{totalPrice}</span>
          </div>

          {error && (
            <div className="text-red-600">
              <>{error?.data?.message}</>
            </div>
          )}

          {/* Esewa Payment Form - Hidden */}
          {cart.paymentMethod === 'Esewa' && (
            <form
              ref={esewaFormRef}
              action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
              method="POST"
              style={{ display: 'none' }}
            >
              <input type="hidden" name="amount" />
              <input type="hidden" name="tax_amount" />
              <input type="hidden" name="total_amount" />
              <input type="hidden" name="transaction_uuid" />
              <input type="hidden" name="product_code" value="EPAYTEST" />
              <input type="hidden" name="product_service_charge" value="0" />
              <input type="hidden" name="product_delivery_charge"/>
              <input type="hidden" name="success_url" value="http://localhost:5173/payment_success" />
              <input type="hidden" name="failure_url" value="http://localhost:5173/failure" />
              <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
              <input type="hidden" name="signature" />
            </form>
          )}

          <button
            type="button"
            disabled={cart.cartItems.length === 0 || isLoading}
            onClick={placeOrderHandler}
            className={`w-full py-2 px-4 text-white rounded ${
              cart.cartItems.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {cart.paymentMethod === 'Esewa' ? 'Pay with Esewa' : 'Place Order'}
          </button>

          {isLoading && <>Loading... </>}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
