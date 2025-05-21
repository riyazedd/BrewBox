import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from "../slices/productApiSlice";
import Paginate from '../components/Paginate.jsx';
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
			{isLoading ? (<div><h1>Loading...</h1></div>) : error ? (<div>{error?.data?.message || error.error}</div>) : (<>
				<div className="flex justify-center">
				<div className="grid grid-cols-4 m-10 gap-10 ">
					{data.products.map((p) => (
						<ProductCard product={p} key={p._id} />
					))}
				</div>
			</div>
			<Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
			</>)}
		</div>
	);
};

export default ShopPage;
