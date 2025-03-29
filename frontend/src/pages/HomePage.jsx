import {React,useState,useEffect} from "react";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import API from "../API";

const HomePage = (props) => {
	const [products,setProducts]=useState([]);

	useEffect(()=>{
		const fetchProducts=async()=>{
			const {data}=await API.get('/api/products');
			setProducts(data)
		}
		fetchProducts();
	},[])

	// console.log(products);
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
