import React, { useMemo } from 'react';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import { useGetProductsQuery } from '../../slices/productApiSlice';
import { Bar, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
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
} from 'chart.js';

import {
  FaBox,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
  FaStar,
  FaTruck,
  FaTimesCircle,
  FaUserPlus,
} from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetOrdersQuery({});
  const { data: users, isLoading: loadingUsers, error: errorUsers } = useGetUsersQuery({});
  const { data: productsData, isLoading: loadingProducts, error: errorProducts } = useGetProductsQuery({});
  const products = productsData?.products || [];

  const stats = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return {
      totalOrders: 0, totalRevenue: 0, totalSubscriptions: 0, monthlyRevenue: [],
      topProduct: null, deliveredOrders: 0, notDeliveredOrders: 0, newUsers: 0, months: [], pendingSubscriptions: 0
    };

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalSubscriptions = orders.filter(order =>
      Array.isArray(order.orderItems) &&
      order.orderItems.some(item => item.product && item.product.category === 'Subscription')
    ).length;
    const deliveredOrders = orders.filter(o => o.isDelivered).length;
    const notDeliveredOrders = orders.filter(o => !o.isDelivered).length;

    let newUsers = 0;
    if (users && Array.isArray(users)) {
      const thirtyDaysAgo = dayjs().subtract(30, 'day');
      newUsers = users.filter(u => dayjs(u.createdAt).isAfter(thirtyDaysAgo)).length;
    }

    const months = Array.from({ length: 6 }, (_, i) =>
      dayjs().subtract(5 - i, 'month').format('YYYY-MM')
    );
    const monthlyRevenue = months.map(month => {
      const monthOrders = orders.filter(o => dayjs(o.createdAt).format('YYYY-MM') === month);
      return monthOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    });

    let productSales = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const id = item.product?._id || item.product;
        if (!productSales[id]) productSales[id] = { qty: 0, name: item.name };
        productSales[id].qty += item.qty || 0;
      });
    });

    const topProduct = Object.values(productSales).sort((a, b) => b.qty - a.qty)[0] || null;

    const pendingSubscriptions = orders.filter(
      order =>
        !order.isDelivered &&
        order.orderItems?.some(item => item.product && item.product.category === 'Subscription')
    ).length;

    return {
      totalOrders,
      totalRevenue,
      totalSubscriptions,
      monthlyRevenue,
      months,
      topProduct,
      deliveredOrders,
      notDeliveredOrders,
      newUsers,
      pendingSubscriptions,
    };
  }, [orders, users]);

  const barChartData = {
    labels: ['Total Orders', 'Total Revenue', 'Subscriptions'],
    datasets: [
      {
        label: 'Stats',
        data: [stats.totalOrders, stats.totalRevenue, stats.totalSubscriptions],
        backgroundColor: ['#10b981', '#6366f1', '#f59e42'],
      },
    ],
  };

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
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">📊 Admin Dashboard</h2>

      {(loadingOrders || loadingUsers || loadingProducts) ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (errorOrders || errorUsers || errorProducts) ? (
        <p className="text-red-600 text-center">
          {errorOrders?.data?.message || errorOrders?.error || ''}
          {errorUsers?.data?.message || errorUsers?.error || ''}
          {errorProducts?.data?.message || errorProducts?.error || ''}
        </p>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Orders', value: stats.totalOrders, color: 'bg-green-200', icon: <FaClipboardList /> },
              { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue}`, color: 'bg-blue-200', icon: <FaMoneyBillWave /> },
              { label: 'Total Users', value: users?.length || 0, color: 'bg-yellow-200', icon: <FaUsers /> },
              { label: 'Total Products', value: products?.length || 0, color: 'bg-purple-200', icon: <FaBox /> },
              { label: 'Pending Subscriptions', value: stats.pendingSubscriptions, color: 'bg-pink-200', icon: <FaStar /> },
              { label: 'Delivered Orders', value: stats.deliveredOrders, color: 'bg-teal-200', icon: <FaTruck /> },
              { label: 'Not Delivered Orders', value: stats.notDeliveredOrders, color: 'bg-red-200', icon: <FaTimesCircle /> },
              { label: 'New Users (30d)', value: stats.newUsers, color: 'bg-indigo-200', icon: <FaUserPlus /> },
            ].map((card, i) => (
              <div key={i} className={`p-4 rounded shadow-md text-center hover:scale-[1.02] transition-transform ${card.color}`}>
                <div className="text-3xl text-gray-700 mb-2 mx-auto">{card.icon}</div>
                <div className="text-md font-semibold">{card.label}</div>
                <div className="text-2xl font-bold">{card.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white p-4 rounded shadow min-h-[320px] sm:min-h-[400px] flex items-center justify-center">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Sales, Revenue & Subscriptions' },
                  },
                  scales: { y: { beginAtZero: true } },
                }}
                height={320}
              />
            </div>
            <div className="bg-white p-4 rounded shadow min-h-[320px] sm:min-h-[400px] flex items-center justify-center">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Monthly Revenue (Last 6 Months)' },
                  },
                  scales: { y: { beginAtZero: true } },
                }}
                height={320}
              />
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center">
              <div className="text-lg font-semibold mb-3 text-gray-800">Top Selling Product</div>
              {stats.topProduct ? (
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.topProduct.name}</div>
                  <div className="text-gray-600 mt-1">Sold: {stats.topProduct.qty}</div>
                </div>
              ) : (
                <div className="text-gray-500">No sales data</div>
              )}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center">
              <div className="text-lg font-semibold mb-3 text-gray-800">Total Subscriptions</div>
              <div className="text-3xl font-bold text-indigo-700">{stats.totalSubscriptions}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
