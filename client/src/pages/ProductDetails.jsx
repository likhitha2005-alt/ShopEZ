import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart`);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!comment.trim()) {
      setReviewError('Please enter a comment for your review');
      return;
    }
    try {
      setSubmittingReview(true);
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
      fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="container page-section"><Message variant="danger">{error}</Message></div>;
  if (!product) return null;

  return (
    <div className="container page-section">
      <Link to="/products" className="back-link">
        &larr; Back to Products
      </Link>

      <div className="product-details-grid">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} onError={(e) => (e.target.src = '/images/placeholder.jpg')} />
        </div>

        <div className="product-details-info">
          <h1>{product.name}</h1>
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          <p className="product-details-brand">Brand: {product.brand}</p>
          <p className="product-details-category">Category: {product.category}</p>
          <h2 className="product-details-price">${product.price.toFixed(2)}</h2>
          <p className="product-details-description">{product.description}</p>
        </div>

        <div className="product-details-actions">
          <div className="summary-row">
            <span>Price:</span>
            <strong>${product.price.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Status:</span>
            <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
          </div>

          {product.countInStock > 0 && (
            <div className="summary-row">
              <span>Quantity:</span>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn btn-primary btn-block"
            disabled={product.countInStock === 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {product.reviews.length === 0 && <Message variant="info">No reviews yet.</Message>}

        <div className="reviews-list">
          {product.reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
              </div>
              <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="write-review">
          <h3>Write a Review</h3>
          {user ? (
            <form onSubmit={submitReview}>
              {reviewError && <Message variant="danger">{reviewError}</Message>}
              <div className="form-group">
                <label>Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <Message variant="info">
              Please <Link to="/login">log in</Link> to write a review.
            </Message>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
