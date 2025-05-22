import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EsewaSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder] = useCreateOrderMutation();
  const hasOrderedRef = useRef(false); // 🔒 prevent multiple order creation

  useEffect(() => {
    const placeOrderAfterEsewa = async () => {
      if (hasOrderedRef.current) return; // 🛑 if already ordered
      hasOrderedRef.current = true;

      try {
        const cartItems = cart.cartItems && cart.cartItems.length
          ? cart.cartItems
          : JSON.parse(localStorage.getItem("cartItems") || "[]");

        if (!cartItems.length) {
          toast.error("No cart items found.");
          navigate("/");
          return;
        }

        const res = await createOrder({
          orderItems: cartItems.map(item => ({
            name: item.product_name,
            qty: item.quantity,
            image: item.image[0],
            price: item.price,
            product: item._id,
          })),
          shippingAddress: cart.shippingAddress,
          paymentMethod: "Esewa",
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }).unwrap();

        dispatch(clearCartItems());
        navigate(`/order/${res._id}`);
      } catch (err) {
        toast.error(err?.data?.message || "Order creation failed after payment.");
        navigate("/");
      }
    };

    placeOrderAfterEsewa();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-xl font-bold mb-4">Processing your order...</h2>
      <p>Please wait while we confirm your payment and place your order.</p>
    </div>
  );
};

export default EsewaSuccessPage;
