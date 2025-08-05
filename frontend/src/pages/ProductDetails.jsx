import { React, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import Rating from "../components/Rating.jsx";
import {
	useGetProductDetailsQuery,
	useCreateReviewMutation,
} from "../slices/productApiSlice.js";
import { addToCart } from "../slices/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";
import StarRatingInput from "../components/StarRatingInput.jsx";
import { toast } from "react-toastify";
// import TopRated from "../components/TopRated.jsx";
import Recommended from "../components/Recommended.jsx";

const ProductDetails = () => {
	const [price, setPrice] = useState(0);
	const [size, setSize] = useState("250");
	const [grind, setGrind] = useState("whole beans");
	const [roast, setRoast] = useState("medium");
	const [quantity, setQuantity] = useState(1);
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");
	const [selectedImage, setSelectedImage] = useState();

	 const userLogin = useSelector((state) => state.auth)
  	const userId = userLogin?.userInfo?._id

	const { id: productId } = useParams();
	const dispatch = useDispatch();
	// const navigate = useNavigate();

	const {
		data: product,
		isLoading,
		error,
		refetch,
	} = useGetProductDetailsQuery(productId);

	const [createReview, { isLoading: loadingReview }] =
		useCreateReviewMutation();

	const { userInfo } = useSelector((state) => state.auth);
	// setRoast(product.roast); 
	useEffect(() => {
		if (product) {
			setPrice(size === "250" ? product.min_price : product.max_price);
			setSelectedImage(product.image[0]); 
			// Default roast if not provided
			// Default main image
			// console.log(product.image[0]);
		}
	}, [size, product]);

	useEffect(() => {
		if (product?.product_name) {
			document.title = `${product.product_name} | BrewBox`;
		}
		return () => {
			document.title = "BrewBox";
		};
	}, [product]);

	const addToCartHandler = () => {
		if (product.countInStock !== undefined && quantity > product.countInStock) {
			toast.error(`Cannot add more than available stock (${product.countInStock})`);
			return;
		}
		dispatch(addToCart({ ...product, quantity, price, size, grind, roast }));
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			await createReview({
				productId,
				rating,
				comment: review,
			}).unwrap();
			refetch();
			toast.success("Review submitted successfully");
			setRating(0);
			setReview("");
		} catch (error) {
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
							<div className="">
								<div className="p-5 sm:my-10 sm:mx-6 md:mx-30 flex flex-col md:flex-row gap-6 md:gap-10 w-full md:w-[81%]">
									{/* === Main Image + Gallery === */}
									<div className="w-full md:w-[50%]">
										{selectedImage && (
											<img
												src={`${
													import.meta.env.VITE_BACKEND_URL ||
													"http://localhost:3000"
												}${selectedImage}`}
												alt="product"
												className="w-full h-60 sm:h-80 md:h-[600px] object-cover border border-gray-100 rounded mb-4"
											/>
										)}

										{/* Image Thumbnails */}
										{product.image && product.image.length > 0 && (
											<div className="flex gap-2 sm:gap-3 flex-wrap">
												{product.image.map((img, idx) => (
													<img
														key={idx}
														src={`${
															import.meta.env.VITE_BACKEND_URL ||
															"http://localhost:3000"
														}${img}`}
														alt={`thumb-${idx}`}
														className={`w-14 h-14 sm:w-20 sm:h-20 object-cover border rounded cursor-pointer ${
															selectedImage === img
																? "ring-2 ring-green-600"
																: ""
														}`}
														onClick={() => setSelectedImage(img)}
													/>
												))}
											</div>
										)}
									</div>

									{/* === Product Info === */}
									<div className="w-full md:w-[50%] flex flex-col ">
										<BreadCrumb product={product} />
										<h1 className="text-2xl sm:text-3xl font-semibold mt-4 sm:mt-8 font-[Helvetica] text-gray-800">
											{product.product_name}
										</h1>
										<h1 className="text-xl sm:text-2xl font-semibold text-green-800 mt-3 sm:mt-5">
											Rs {product.min_price} - Rs {product.max_price}
										</h1>
										<div className="mt-2">
											<Rating
												value={product.rating}
												text={`${product.numReviews} reviews`}
											/>
										</div>
										<p className="mt-4 sm:mt-8 text-base sm:text-lg text-gray-600 text-justify">
											{product.description}
										</p>
										<div className="mt-6 sm:mt-10">
											<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
												<p className="text-lg sm:text-xl font-semibold">Size: </p>
												<select
													onChange={(e) => setSize(e.target.value)}
													className="w-full sm:w-52 p-2 border border-gray-500 rounded text-base sm:text-lg text-gray-600"
												>
													<option value="250">250gm</option>
													<option value="500">500gm</option>
												</select>
											</div>
											{product.category === "Subscription" && (
												<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-7 mt-4 sm:mt-5">
													<p className="text-lg sm:text-xl font-semibold">Roast: </p>
													<select onChange={(e) => setRoast(e.target.value)} className="w-full sm:w-52 p-2 border border-gray-500 rounded text-base sm:text-lg text-gray-600">
														<option value="medium">Medium</option>
														<option value="medium-dark">Medium-Dark</option>
													</select>
												</div>
											)}
											<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-7 mt-4 sm:mt-5">
												<p className="text-lg sm:text-xl font-semibold">Grind: </p>
												<select onChange={(e) => setGrind(e.target.value)} className="w-full sm:w-52 p-2 border border-gray-500 rounded text-base sm:text-lg text-gray-600">
													<option value="whole beans">Whole Beans</option>
													<option value="standard medium">
														Standard Medium
													</option>
													<option value="french press">French Press</option>
													<option value="pour over">Pour Over</option>
													<option value="home espresso">Home Espresso</option>
												</select>
											</div>
											<div className="mt-4 sm:mt-5">
												<p className="text-xl sm:text-2xl font-bold text-green-800">
													Rs {price}
												</p>
											</div>
											<div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
												<QuantitySelector
													quantity={quantity}
													setQuantity={val => {
														if (product.countInStock !== undefined && val > product.countInStock) {
															setQuantity(product.countInStock);
															toast.error(`Cannot select more than available stock (${product.countInStock})`);
														} else {
															setQuantity(val);
														}
													}}
												/>
												<button
													onClick={addToCartHandler}
													className="bg-green-800 text-white font-bold text-base sm:text-lg p-2 hover:cursor-pointer"
												>
													ADD TO CART
												</button>
												{product.countInStock !== undefined && (
													<span className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-lg text-gray-600">In stock: <span className="font-semibold">{product.countInStock}</span></span>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* === Reviews Section === */}
								<div className="flex flex-col items-center w-full md:w-[100%]">
									<div className="w-full md:w-1/2 p-2 sm:p-4">
										<h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Reviews</h2>
										{product.reviews.length === 0 && (
											<div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
												No Reviews
											</div>
										)}
										<div className="space-y-4">
											{product.reviews.map((review) => (
												<div
													key={review._id}
													className="border border-gray-200 p-3 sm:p-4 rounded shadow-sm"
												>
													<div className="flex items-center mb-2 justify-between">
														<strong className="block">{review.name}</strong>
														<p className="text-xs sm:text-sm text-gray-500">
															{review.createdAt.substring(0, 10)}
														</p>
													</div>
													<Rating value={review.rating} />
													<p>{review.comment}</p>
												</div>
											))}
											<div className="border border-gray-300 p-3 sm:p-4 rounded shadow-sm">
												<h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
													Write a Customer Review
												</h2>
												{loadingReview && <>Loading...</>}
												{userInfo ? (
													<form onSubmit={submitHandler} className="space-y-3 sm:space-y-4">
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

								{/* === Top Rated Products Section === */}
								<div className="mt-10 sm:mt-20 border-t border-gray-300 pt-6 sm:pt-10">
									<Recommended userId={userId} />
								</div>
							</div>
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
