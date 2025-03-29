import { React, useEffect, useState } from "react";
import Banner from "../components/Banner";
import products from "../product.js";
import ProductCard from "../components/ProductCard.jsx"
import API from "../API.jsx";

const SubscriptionPage = (props) => {
	const [product, setProduct] = useState([]); 

	
	useEffect(() => {
		const fetchProducts=async()=>{
			const {data}=await API.get('/api/products');
			const subscriptionProducts = data.filter((p) => p.category === "Subscription");
			setProduct(subscriptionProducts);
		}
		fetchProducts()
	}, []);

	// console.log(product);

	return (
		<div>
			<Banner title={props.title} />
			<div className="flex justify-center">
            <div className="grid grid-cols-3 m-10 gap-10 w-2/3">
				{product.length > 0 ? (
					product.map((p) => (
						<ProductCard product={p} key={p._id}/>
					))
				) : (
					<p>No Subscription Products Available</p>
				)}
			</div>
            </div>
		</div>
	);
};

export default SubscriptionPage;
