import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setCredentials(null));
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between py-8 px-4 min-h-screen">
        <div>
          <div className="mb-10 text-2xl font-bold text-green-400 text-center">BrewBox - Admin</div>
          <nav className="flex flex-col gap-6">
            <Link to="/admin/dashboard" className="hover:text-green-400">Dashboard</Link>
            <Link to="/admin/productlist" className="hover:text-green-400">Products</Link>
            <Link to="/admin/orderlist" className="hover:text-green-400">Orders</Link>
            <Link to="/admin/subscriptionlist" className="hover:text-green-400">Subscriptions</Link>
            <Link to="/admin/userlist" className="hover:text-green-400">Users</Link>
            <button
          onClick={handleLogout}
          className="mt-10 w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
        >
          Logout
        </button>
          </nav>
        </div>
        
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
