import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <div className="product-card-image">
          <img src={product.image} alt={product.name} onError={(e) => (e.target.src = '/images/placeholder.jpg')} />
          {product.countInStock === 0 && (
            <span className="badge-out-of-stock">Out of Stock</span>
          )}
        </div>
      </Link>
      <div className="product-card-body">
        <span className="product-card-brand">{product.brand}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        <Rating value={product.rating} text={`(${product.numReviews})`} />
        <div className="product-card-price">${product.price.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
