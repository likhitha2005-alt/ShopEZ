import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Message from '../components/Message';

const PlaceOrder = () => {
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.1 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container page-section">
        <Message variant="info">
          Your cart is empty. <Link to="/products">Go shopping</Link>
        </Message>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <h1>Review Your Order</h1>
      <div className="cart-layout">
        <div className="order-review-details">
          <div className="review-block">
            <h3>Shipping</h3>
            <p>
              {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
              {shippingAddress.country}
            </p>
          </div>

          <div className="review-block">
            <h3>Payment Method</h3>
            <p>{paymentMethod}</p>
          </div>

          <div className="review-block">
            <h3>Order Items</h3>
            {cartItems.map((item) => (
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
          {error && <Message variant="danger">{error}</Message>}
          <div className="summary-row">
            <span>Items:</span>
            <strong>${itemsPrice.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <strong>${shippingPrice.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <strong>${taxPrice.toFixed(2)}</strong>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
          <button className="btn btn-primary btn-block" onClick={placeOrderHandler} disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
