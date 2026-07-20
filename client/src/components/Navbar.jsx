import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Shop<span>EZ</span>
        </Link>

        <form className="navbar-search" onSubmit={submitSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch />
          </button>
        </form>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          <Link to="/cart" className="navbar-cart" onClick={() => setMenuOpen(false)}>
            <FaShoppingCart />
            Cart
            {itemsCount > 0 && <span className="cart-badge">{itemsCount}</span>}
          </Link>

          {user ? (
            <div className="navbar-user-menu">
              <span className="navbar-user">
                <FaUser /> {user.name.split(' ')[0]}
              </span>
              <div className="dropdown">
                <Link to="/profile">My Profile</Link>
                <Link to="/myorders">My Orders</Link>
                {user.isAdmin && <Link to="/admin/dashboard">Admin Dashboard</Link>}
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <FaUser /> Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
