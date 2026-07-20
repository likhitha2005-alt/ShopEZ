import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Shipping = () => {
  const { shippingAddress, setShippingAddress, paymentMethod, setPaymentMethod } = useCart();
  const navigate = useNavigate();

  const [street, setStreet] = useState(shippingAddress.street || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    setShippingAddress({ street, city, postalCode, country });
    navigate('/placeorder');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Shipping Address</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main St"
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Springfield"
            />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="12345"
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
            />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Continue to Review Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
