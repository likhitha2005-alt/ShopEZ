import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products?pageSize=1'),
          api.get('/orders'),
        ]);

        const orders = ordersRes.data;
        const revenue = orders
          .filter((o) => o.isPaid)
          .reduce((acc, o) => acc + o.totalPrice, 0);
        const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

        setStats({
          products: productsRes.data.total,
          orders: orders.length,
          revenue,
          pendingOrders,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container page-section">
      <h1>Admin Dashboard</h1>
      {error && <Message variant="danger">{error}</Message>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.products}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>{stats.orders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>${stats.revenue.toFixed(2)}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingOrders}</h3>
          <p>Pending Orders</p>
        </div>
      </div>

      <div className="dashboard-links">
        <Link to="/admin/products" className="btn btn-primary">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="btn btn-outline">
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
