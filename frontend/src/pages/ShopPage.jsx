import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Paginate from "../components/Paginate.jsx";
// import ProductCarousel from '../components/ProductCarousel';

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
	const { pageNumber, keyword } = useParams();

	const { data, isLoading, error } = useGetProductsQuery({
		keyword,
		pageNumber,
	});

	return (
		<div>
			<Banner title={props.title} />
			{isLoading ? (
				<div>
					<h1>Loading...</h1>
				</div>
			) : error ? (
				<div>
					{typeof error === "string"
						? error
						: error?.data?.message || error?.error || JSON.stringify(error)}
				</div>
			) : (
				<>
					<div className="flex justify-center p-8 sm:p-0">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:m-6 md:m-10 gap-4 sm:gap-6 md:gap-10 w-full">
							{data.products.map((p) => (
								<ProductCard product={p} key={p._id} />
							))}
						</div>
					</div>
					<Paginate
						pages={data.pages}
						page={data.page}
						keyword={keyword ? keyword : ""}
					/>
				</>
			)}
		</div>
	);
};

export default ShopPage;
