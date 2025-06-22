import {FaTimes, FaList} from 'react-icons/fa'
import {useGetOrdersQuery} from '../../slices/ordersApiSlice'
import { Link } from 'react-router-dom';

const AdminOrderList = () => {
    // const { pageNumber } = useParams();
        
          const { data:orders, isLoading, error, refetch } = useGetOrdersQuery({
            // pageNumber,
          });
  return (
    <div className="mx-20 my-10">
			<div className="justify-between">
				<div className="flex items-center text-2xl gap-2">
					<FaList />
					<p>Orders List</p>
				</div>
                {isLoading ? (<>Loading...</>) : error ? (<>{error}</>) : (
                    <div class="overflow-hidden mt-10 ">
						<table class=" min-w-full rounded-xl">
							<thead>
								<tr class="bg-gray-50 uppercase">
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										{" "}
										Id{" "}
									</th>
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
									>
										{" "}
										User{" "}
									</th>
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
									>
										{" "}
										Date{" "}
									</th>
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
									>
										{" "}
										Total{" "}
									</th>
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										{" "}
										Payment Method{" "}
									</th>
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										{" "}
										Delivered{" "}
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-300 ">
								{orders.map((order) => (
									<tr
										key={order._id}
										class="bg-white transition-all duration-500 hover:bg-gray-50"
									>
										<td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
											{order._id}
										</td>
										<td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
											{order.user && order.user.name}
										</td>
										<td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
											{order.createdAt.substring(0,10)}
										</td>
										<td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
											Rs. {order.totalPrice}
										</td>
										<td class="uppercase p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
											{order.paymentMethod}
										</td>
										<td class="uppercase p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
											{order.isDelivered ? (
                                                order.deliveredAt.substring(0, 10)
                                                ) : (
                                                <FaTimes className="text-red-600" />
                                             )}
										</td>
                                        <td>
                                            <Link to={`/order/${order._id}`}>
                                                <button className='px-4 py-2 rounded bg-gray-200 hover:cursor-pointer'>Details</button>
                                            </Link>
                                        </td>
									</tr>
								))}
							</tbody>
						</table>
						
					</div>
                )}
			</div>
		</div>
  )
}

export default AdminOrderList
