import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const markAsPaid = async () => {
    try {
      await api.put(`/orders/${id}/pay`);
      toast.success('Order marked as paid');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="container page-section"><Message variant="danger">{error}</Message></div>;
  if (!order) return null;

  return (
    <div className="container page-section">
      <h1>Order #{order._id}</h1>
      <div className="cart-layout">
        <div className="order-review-details">
          <div className="review-block">
            <h3>Shipping</h3>
            <p>
              {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <Message variant={order.isDelivered ? 'success' : 'info'}>
              {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : `Status: ${order.status}`}
            </Message>
          </div>

          <div className="review-block">
            <h3>Payment Method</h3>
            <p>{order.paymentMethod}</p>
            <Message variant={order.isPaid ? 'success' : 'warning'}>
              {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
            </Message>
          </div>

          <div className="review-block">
            <h3>Order Items</h3>
            {order.orderItems.map((item) => (
              <div key={item.product} className="review-item">
                <img src={item.image} alt={item.name} onError={(e) => (e.target.src = '/images/placeholder.jpg')} />
                <Link to={`/products/${item.product}`}>{item.name}</Link>
                <span>
                  {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items:</span>
            <strong>${order.itemsPrice.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <strong>${order.shippingPrice.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <strong>${order.taxPrice.toFixed(2)}</strong>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <strong>${order.totalPrice.toFixed(2)}</strong>
          </div>
          {!order.isPaid && (
            <button className="btn btn-primary btn-block" onClick={markAsPaid}>
              Mark As Paid (Demo)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
