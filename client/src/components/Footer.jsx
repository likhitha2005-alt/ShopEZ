const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h3>ShopEZ</h3>
          <p>Your one-stop shop for everything you need, delivered fast.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>About Us</li>
            <li>Contact</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div>
          <h4>Customer Service</h4>
          <ul>
            <li>Shipping Policy</li>
            <li>Returns</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} ShopEZ. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
