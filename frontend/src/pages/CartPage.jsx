import React from 'react'
import Banner from '../components/Banner'
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


const CartPage = (props) => {
  const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;
	// console.log(cart.itemsPrice)
  const navigate=useNavigate();

	const addToCartHandler = async (product, qty) => {
		dispatch(addToCart({ ...product, quantity: qty }));
	};

	const removeFromCartHandler = async (id) => {
		dispatch(removeFromCart(id));
	};

	const checkoutHandler = () => {
		navigate("/login?redirect=/shipping");
	};

  return (
    <div>
      <Banner title={props.title}/>
      <div className='w-full flex justify-center mt-10'>
      <div className="flex flex-col md:flex-row gap-6 mt-5 w-[75%]">
				<div className="md:w-3/4">
					<div className="overflow-x-auto">
						<table className="w-full min-w-max border-collapse">
							<thead>
								<tr className="bg-gray-100">
									<th className="text-left font-semibold p-2">Product</th>
									<th className="text-left font-semibold p-2">Price</th>
									<th className="text-left font-semibold p-2">Quantity</th>
									<th className="text-left font-semibold p-2">Total</th>
									<th className="text-center font-semibold p-2">Action</th>
								</tr>
							</thead>
							<tbody>
								{cartItems.length > 0 ? (
									cartItems.map((item) => (
										<tr key={item._id} className="border-b">
											<td className="py-4 px-2">
												<Link to={`/products/${item._id}`}>
													<div className="flex items-center gap-2">
														<img
															className="h-12 w-12 object-cover"
															src={`${
													import.meta.env.VITE_BACKEND_URL ||
													"http://localhost:3000"
												}${item.image}`}
															alt="Product"
														/>
														<span className="font-semibold text-sm md:text-base">
															{item.product_name}
														</span>
													</div>
												</Link>
											</td>
											<td className="py-4 px-2 text-sm md:text-base">
												Rs {item.price}
											</td>
											<td className="py-4 px-2">
												<div className="flex items-center">
													<input
														type="number"
														className="border rounded p-1 w-16 text-sm"
														min={1}
														max={item.countInStock}
														value={item.quantity}
														onChange={(e) =>
															addToCartHandler(item, Number(e.target.value))
														}
													/>
												</div>
											</td>
											<td className="py-4 px-2 text-sm md:text-base">
												Rs {item.price * item.quantity}
											</td>
											<td className="py-4 px-2 text-center">
												<button
													onClick={() => removeFromCartHandler(item._id)}
													className="bg-gray-300 p-2 rounded text-red-500 hover:bg-gray-400"
												>
													<FaTrash />
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={5} className="text-lg text-center pt-5">
											No Items on Cart
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
				<div className="md:w-1/4">
					<div className="bg-white rounded-lg shadow-md p-6">
						<h2 className="text-lg font-semibold mb-4">
							Summary ({cartItems.reduce((a, i) => a + i.quantity, 0)}) items
						</h2>
						<div className="flex justify-between mb-2">
							<span>Subtotal</span>
							<span>{cart.itemsPrice}</span>
						</div>
						<div className="flex justify-between mb-2">
							<span>Taxes</span>
							<span>{cart.taxPrice}</span>
						</div>
						<div className="flex justify-between mb-2">
							<span>Shipping</span>
							<span>{cart.shippingPrice}</span>
						</div>
						<hr className="my-2" />
						<div className="flex justify-between mb-2">
							<span className="font-semibold">Total</span>
							<span className="font-semibold">{cart.totalPrice}</span>
						</div>
						<button
							disabled = {cartItems.length === 0}
							onClick={checkoutHandler}
							className={`bg-green-900 font-bold text-white py-2 px-4 rounded-lg mt-4 w-full  ${cartItems.length === 0 ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
						>
							Checkout
						</button>
					</div>
				</div>
			</div>
      </div>
    </div>
  )
}

export default CartPage
