import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (!user) {
      navigate('/login?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div className="container page-section">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Message variant="info">
          Your cart is empty. <Link to="/products">Go shopping</Link>
        </Message>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <img src={item.image} alt={item.name} onError={(e) => (e.target.src = '/images/placeholder.jpg')} />
                <Link to={`/products/${item.product}`} className="cart-item-name">
                  {item.name}
                </Link>
                <span className="cart-item-price">${item.price.toFixed(2)}</span>
                <select
                  value={item.qty}
                  onChange={(e) => updateQty(item.product, Number(e.target.value))}
                >
                  {[...Array(Math.min(item.countInStock || 10, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button
                  className="icon-btn-danger"
                  onClick={() => removeFromCart(item.product)}
                  aria-label="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items ({cartItems.reduce((a, i) => a + i.qty, 0)}):</span>
              <strong>${itemsPrice.toFixed(2)}</strong>
            </div>
            <button className="btn btn-primary btn-block" onClick={checkoutHandler}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
