// import {React,useState,useEffect} from "react";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
// import API from "../API";
import { useGetProductsQuery } from "../slices/productApiSlice";

const ShopPage = (props) => {
	// const [products,setProducts]=useState([]);

	// useEffect(()=>{
	// 	const fetchProducts=async()=>{
	// 		const {data}=await API.get('/api/products');
	// 		setProducts(data)
	// 	}
	// 	fetchProducts();
	// },[])

	// console.log(products);

	const {data:products,isLoading,error}=useGetProductsQuery();
	return (
		<div>
			<Banner title={props.title} />
			{isLoading ? (<div><h1>Loading...</h1></div>) : error ? (<div>{error.data.message || error.error}</div>) : (<>
				<div className="flex justify-center">
				<div className="grid grid-cols-4 m-10 gap-10 ">
					{products.map((p) => (
						<ProductCard product={p} key={p._id} />
					))}
				</div>
			</div>
			</>)}
		</div>
	);
};

export default ShopPage;
