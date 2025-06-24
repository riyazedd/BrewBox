import React, { useMemo } from 'react'
import { useGetOrdersQuery } from '../../slices/ordersApiSlice'
import { useGetUsersQuery } from '../../slices/usersApiSlice'
import { useGetProductsQuery } from '../../slices/productApiSlice'
import { Bar, Line } from 'react-chartjs-2'
import dayjs from 'dayjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

const AdminDashboard = () => {
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetOrdersQuery({})
  const { data: users, isLoading: loadingUsers, error: errorUsers } = useGetUsersQuery({})
  const { data: productsData, isLoading: loadingProducts, error: errorProducts } = useGetProductsQuery({})
  const products = productsData?.products || []

  // Calculate stats
  const stats = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return {
      totalOrders: 0, totalRevenue: 0, totalSubscriptions: 0, monthlyRevenue: [], topProduct: null
    }
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
    const totalSubscriptions = orders.filter(order =>
      Array.isArray(order.orderItems) &&
      order.orderItems.some(item => item.product && item.product.category === 'Subscription')
    ).length
    // Revenue by month (last 6 months)
    const months = Array.from({length: 6}, (_, i) => dayjs().subtract(5 - i, 'month').format('YYYY-MM'))
    const monthlyRevenue = months.map(month => {
      const monthOrders = orders.filter(o => dayjs(o.createdAt).format('YYYY-MM') === month)
      return monthOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
    })
    // Top selling product
    let productSales = {}
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const id = item.product?._id || item.product
        if (!productSales[id]) productSales[id] = { qty: 0, name: item.name }
        productSales[id].qty += item.qty || 0
      })
    })
    const topProduct = Object.values(productSales).sort((a, b) => b.qty - a.qty)[0] || null
    return { totalOrders, totalRevenue, totalSubscriptions, monthlyRevenue, months, topProduct }
  }, [orders])

  // Chart data
  const barChartData = {
    labels: ['Total Orders', 'Total Revenue', 'Subscriptions'],
    datasets: [
      {
        label: 'Stats',
        data: [stats.totalOrders, stats.totalRevenue, stats.totalSubscriptions],
        backgroundColor: ['#10b981', '#6366f1', '#f59e42'],
      },
    ],
  }
  const lineChartData = {
    labels: stats.months,
    datasets: [
      {
        label: 'Revenue by Month',
        data: stats.monthlyRevenue,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        fill: true,
      },
    ],
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {(loadingOrders || loadingUsers || loadingProducts) ? (
        <p>Loading...</p>
      ) : (errorOrders || errorUsers || errorProducts) ? (
        <p className="text-red-600">Error loading data</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-100 p-4 rounded text-center">
              <div className="text-lg font-semibold">Total Orders</div>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </div>
            <div className="bg-blue-100 p-4 rounded text-center">
              <div className="text-lg font-semibold">Total Revenue</div>
              <div className="text-2xl font-bold">Rs. {stats.totalRevenue}</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded text-center">
              <div className="text-lg font-semibold">Total Users</div>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </div>
            <div className="bg-purple-100 p-4 rounded text-center">
              <div className="text-lg font-semibold">Total Products</div>
              <div className="text-2xl font-bold">{products?.length || 0}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded shadow">
              <Bar data={barChartData} options={{
                responsive: true,
                plugins: { legend: { display: false }, title: { display: true, text: 'Sales, Revenue & Subscriptions' } },
                scales: { y: { beginAtZero: true } },
              }} />
            </div>
            <div className="bg-white p-4 rounded shadow">
              <Line data={lineChartData} options={{
                responsive: true,
                plugins: { legend: { display: false }, title: { display: true, text: 'Monthly Revenue (Last 6 Months)' } },
                scales: { y: { beginAtZero: true } },
              }} />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-lg font-semibold mb-2">Top Selling Product</div>
              {stats.topProduct ? (
                <div>
                  <div className="text-xl font-bold">{stats.topProduct.name}</div>
                  <div className="text-gray-600">Sold: {stats.topProduct.qty}</div>
                </div>
              ) : (
                <div>No sales data</div>
              )}
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="text-lg font-semibold mb-2">Total Subscriptions</div>
              <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
