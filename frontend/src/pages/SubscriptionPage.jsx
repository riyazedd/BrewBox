import { React, useEffect, useState } from "react";
import Banner from "../components/Banner";
import { useGetProductsQuery } from "../slices/productApiSlice.js";
import ProductCard from "../components/ProductCard.jsx";

const SubscriptionPage = (props) => {
	const [product, setProduct] = useState([]);

	const { data: products, isLoading, error } = useGetProductsQuery();

	useEffect(() => {
		if (products) {
			const subscriptionProducts = products.filter((p) => p.category === "Subscription");
			setProduct(subscriptionProducts);
		}
	}, [products]); 

	return (
		<div>
			<Banner title={props.title} />
			{isLoading ? (
				<div>Loading...</div>
			) : error ? (
				<div>{error.data?.message || error.error}</div>
			) : (
				<div className="flex justify-center">
					<div className="grid grid-cols-3 m-10 gap-10 w-2/3">
						{product.length > 0 ? (
							product.map((p) => <ProductCard product={p} key={p._id} />)
						) : (
							<p>No Subscription Products Available</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default SubscriptionPage;
