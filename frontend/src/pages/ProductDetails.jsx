import { React, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import Rating from "../components/Rating.jsx";
// import API from "../API.jsx";
import {
	useGetProductDetailsQuery,
	useCreateReviewMutation,
} from "../slices/productApiSlice.js";
import { addToCart } from "../slices/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";
import StarRatingInput from "../components/StarRatingInput.jsx";
import {toast} from 'react-toastify'

const ProductDetails = () => {
	const [price, setPrice] = useState(0);
	const [size, setSize] = useState("250");
	const [quantity, setQuantity] = useState(1);
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");
	const { id: productId } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// useEffect(() => {
	// 	const fetchProduct = async()=>{
	// 		const {data}=await API.get(`/api/products/${productId}`);
	// 		setProduct(data)
	// 	}

	// 	fetchProduct();
	// }, [productId]);

	const {
		data: product,
		isLoading,
		error,
		refetch,
	} = useGetProductDetailsQuery(productId);

	const [createReview, { isLoading: loadingReview }] =
		useCreateReviewMutation();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		if (product) {
			setPrice(size === "250" ? product.min_price : product.max_price);
		}
	}, [size, product]);

	const addToCartHandler = () => {
		dispatch(addToCart({ ...product, quantity, price }));
		// navigate('/cart')
	};

	useEffect(() => {
		if (product?.product_name) {
			document.title = `${product.product_name} | BrewBox`;
		}
		return () => {
			document.title = "BrewBox"; // Reset when leaving page
		};
	}, [product]);

	const submitHandler = async (e) => {
		e.preventDefault();
		try{
			await createReview({
			productId,
			rating,
			comment: review,
			}).unwrap();
			refetch();
			toast.success("Review submitted successfully");
			setRating(0);
			setReview("");
		}catch (error) {
			toast.error(error?.data?.message || error.error);
		}
		
	};

	return (
		<>
			{isLoading ? (
				<div>Loading...</div>
			) : error ? (
				<div>{error.data.message || error.error}</div>
			) : (
				<>
					<div className="flex flex-col justify-center items-center">
						{product ? (
							<>
								<div className="my-10 mx-30 flex gap-10 w-[81%]">
									{/* <Meta title={product?.product_name} /> */}
									<img
										src={product.image}
										alt="product"
										className="w-[50%] border border-gray-100 rounded"
									/>
									<div>
										<BreadCrumb product={product} />
										<h1 className="text-3xl font-semibold mt-8 font-[Helvetica] text-gray-800">
											{product.product_name}
										</h1>
										<h1 className="text-2xl font-semibold text-green-800 mt-5">
											Rs {product.min_price} - Rs {product.max_price}
										</h1>
										<div className="mt-2">
											<Rating
												value={product.rating}
												text={`${product.numReviews} reviews`}
											/>
										</div>
										<p className="mt-8 text-lg text-gray-600 text-justify">
											{product.description}
										</p>
										<div className="mt-10">
											<div className="flex items-center gap-10">
												<p className="text-xl font-semibold">Size: </p>
												<select
													onChange={(e) => setSize(e.target.value)}
													className="w-52 p-2 border border-gray-500 rounded text-lg text-gray-600"
												>
													<option value="250">250gm</option>
													<option value="500">500gm</option>
												</select>
											</div>
											{product.category === "Subscription" ? (
												<div className="flex items-center gap-7 mt-5">
													<p className="text-xl font-semibold">Roast: </p>
													<select className="w-52 p-2 border border-gray-500 rounded text-lg text-gray-600">
														<option value="medium">Medium</option>
														<option value="medium-dark">Medium-Dark</option>
													</select>
												</div>
											) : (
												<div></div>
											)}
											<div className="flex items-center gap-7 mt-5">
												<p className="text-xl font-semibold">Grind: </p>
												<select className="w-52 p-2 border border-gray-500 rounded text-lg text-gray-600">
													<option value="whole beans">Whole Beans</option>
													<option value="standard medium">
														Standard Medium
													</option>
													<option value="french press">French Press</option>
													<option value="pour over">Pour Over</option>
													<option value="home espresso">Home Espresso</option>
												</select>
											</div>
											<div className="mt-5">
												<p className="text-2xl font-bold text-green-800">
													Rs {price}
												</p>
											</div>
											<div className="mt-5 flex gap-3">
												<QuantitySelector
													quantity={quantity}
													setQuantity={setQuantity}
												/>
												<button
													onClick={addToCartHandler}
													className="bg-green-800 text-white font-bold text-lg p-2 hover:cursor-pointer"
												>
													ADD TO CART
												</button>
											</div>
										</div>
									</div>
								</div>
								<div className="flex flex-col justify-center  md:flex-row w-full">
									<div className="w-full md:w-1/2 p-4">
										<h2 className="text-2xl font-semibold mb-4">Reviews</h2>
										{product.reviews.length === 0 && (
											<div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
												No Reviews
											</div>
										)}
										<div className="space-y-4">
											{product.reviews.map((review) => (
												<div
													key={review._id}
													className="border border-gray-200 p-4 rounded shadow-sm"
												>
													<div className="flex items-center mb-2 justify-between">
														<strong className="block">{review.name}</strong>
													<p className="text-sm text-gray-500">
														{review.createdAt.substring(0, 10)}
													</p>
													</div>
													<Rating value={review.rating} />
													<p>{review.comment}</p>
												</div>
											))}
											<div className="border border-gray-300 p-4 rounded shadow-sm">
												<h2 className="text-xl font-semibold mb-4">
													Write a Customer Review
												</h2>

												{loadingReview && <>Loading... </>}

												{userInfo ? (
													<form onSubmit={submitHandler} className="space-y-4">
														<div>
															<label
																htmlFor="rating"
																className="block mb-1 font-medium"
															>
																Rating
															</label>
															<StarRatingInput
																rating={rating}
																setRating={setRating}
															/>
														</div>
														<div>
															<label
																htmlFor="comment"
																className="block mb-1 font-medium"
															>
																Comment
															</label>
															<textarea
																id="comment"
																required
																rows="3"
																className="w-full border border-gray-300 rounded px-3 py-2"
																value={review}
																onChange={(e) => setReview(e.target.value)}
															></textarea>
														</div>
														<button
															type="submit"
															disabled={loadingReview}
															className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
														>
															Submit
														</button>
													</form>
												) : (
													<div className="bg-blue-100 text-blue-800 p-3 rounded">
														Please{" "}
														<Link
															to="/login"
															className="text-blue-600 underline"
														>
															sign in
														</Link>{" "}
														to write a review
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</>
						) : (
							<div>
								<h1>No product found</h1>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default ProductDetails;
