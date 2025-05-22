import {React, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating.jsx";
import { addToCart } from "../slices/cartSlice.js";
import { useDispatch } from "react-redux";

const ProductCard = ({ product }) => {
	const quantity = 1;
	const [selectedImage, setSelectedImage] = useState();
	const price = product.min_price;
	const addToCartHandler = () => {
		dispatch(addToCart({ ...product, quantity, price }));
		// navigate('/cart')
	};
	const dispatch = useDispatch();
	// console.log(product);

	useEffect(() => {
		if (product) {
			setSelectedImage(product.image[0]); // Default main image
		}
	}, [product]);

	return (
		<div className="p-5 w-fit flex flex-col items-center gap-3  shadow rounded hover:shadow-lg transition ease-in-out duration-300">
			<Link to={`/product/${product._id}`}>
					{selectedImage && (
						<img
						src={
							 product.image ? `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}${selectedImage}` : ""
						
						}
						alt="coffee"
						className="w-70"
					/>
					)}
				<div className="flex flex-col items-center gap-3 mt-2">
					<p className="text-lg font-[Poppins]">{product.product_name}</p>
					<p className="text-base text-gray-600 font-[Poppins]">
						{product.category}
					</p>
					<p className="text-lg text-green-800 font-bold">
						Rs {product.min_price} - Rs {product.max_price}
					</p>
					<Rating
						value={product.rating}
						text={`${product.numReviews} reviews`}
					/>
				</div>
			</Link>
			<button
				onClick={addToCartHandler}
				className="px-5 py-3 bg-green-800 font-[Poppins] w-[80%] text-white font-bold hover:cursor-pointer"
			>
				Add to Cart
			</button>
		</div>
	);
};

export default ProductCard;
