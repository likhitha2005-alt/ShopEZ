import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const emptyProduct = {
  name: '',
  price: '',
  image: '/images/placeholder.jpg',
  brand: '',
  category: '',
  countInStock: '',
  description: '',
  featured: false,
};

const ProductEdit = () => {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [product, setProduct] = useState(emptyProduct);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
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
    fetchProduct();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...product,
      price: Number(product.price),
      countInStock: Number(product.countInStock),
    };

    try {
      setSaving(true);
      if (isNew) {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      } else {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container page-section">
      <Link to="/admin/products" className="back-link">
        &larr; Back to Products
      </Link>
      <div className="auth-card">
        <h1>{isNew ? 'Add New Product' : 'Edit Product'}</h1>
        {error && <Message variant="danger">{error}</Message>}

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" name="name" required value={product.name} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                required
                value={product.price}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Count In Stock</label>
              <input
                type="number"
                name="countInStock"
                min="0"
                required
                value={product.countInStock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Brand</label>
              <input type="text" name="brand" required value={product.brand} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" required value={product.category} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input type="text" name="image" value={product.image} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows={5}
              required
              value={product.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={!!product.featured}
                onChange={handleChange}
              />
              Feature this product on homepage
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
