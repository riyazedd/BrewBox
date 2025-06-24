import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Banner from "../components/Banner";
import { useGetProductsQuery } from "../slices/productApiSlice.js";
import ProductCard from "../components/ProductCard.jsx";

const SubscriptionPage = (props) => {
	const [product, setProduct] = useState([]);
	const { pageNumber, keyword } = useParams();
	
	  const { data, isLoading, error } = useGetProductsQuery({
		keyword,
		pageNumber,
	  });

	useEffect(() => {
		if (data) {
			const subscriptionProducts = data.products ? data.products.filter((p) => p.category === "Subscription") : [];
			setProduct(subscriptionProducts);
		}
	}, [data]);

	return (
		<div>
			<Banner title={props.title} />
			{isLoading ? (
				<div>Loading...</div>
			) : error ? (
				<div>{error.data?.message || error.error}</div>
			) : (
				<div className="flex justify-center">
					<div className="grid grid-cols-4 m-10 gap-10">
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
