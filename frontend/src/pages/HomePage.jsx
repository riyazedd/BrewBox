import React from "react";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import products from "../product.js";

const HomePage = (props) => {
	return (
		<div>
			<Banner title={props.title} />
			<div className="flex justify-center">
                <p></p>
				<div className="grid grid-cols-3 m-10 gap-10 w-2/3">
					{products.map((p) => (
						<ProductCard product={p} key={p._id} />
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
