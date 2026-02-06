import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiMinus } from 'react-icons/fi';
import CustomSelect from '../../components/common/CustomSelect';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './AdminProducts.css';

/**
 * Admin products management page
 */
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'earrings',
    stock: '',
    featured: false,
    images: [''],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll({ limit: 100 });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'earrings',
      stock: '',
      featured: false,
      images: [''],
    });
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
      images: product.images.length > 0 ? product.images : [''],
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: formData.images.filter(img => img.trim() !== ''),
    };

    try {
      if (editingProduct) {
        await productAPI.update(editingProduct._id, productData);
        toast.success('Product updated successfully');
      } else {
        await productAPI.create(productData);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productAPI.delete(productId);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleQuickStockUpdate = async (productId, newStock) => {
    if (newStock < 0) return;
    
    try {
      await productAPI.update(productId, { stock: newStock });
      setProducts(prev => 
        prev.map(p => p._id === productId ? { ...p, stock: newStock } : p)
      );
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const categories = ['earrings', 'clips', 'necklaces', 'bracelets', 'accessories'];

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus size={18} />
          Add Product
        </button>
      </div>

      <div className="products-table-container">
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="table-empty">
            <p>No products found</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Add Your First Product
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-image">
                        <img 
                          src={product.images?.[0] || '/images/placeholder.jpg'} 
                          alt={product.name} 
                        />
                      </div>
                      <span className="product-name">{product.name}</span>
                    </div>
                  </td>
                  <td className="capitalize">{product.category}</td>
                  <td className="product-price">${product.price.toFixed(2)}</td>
                  <td>
                    <div className="stock-editor">
                      <button 
                        className="stock-btn minus"
                        onClick={() => handleQuickStockUpdate(product._id, product.stock - 1)}
                        disabled={product.stock <= 0}
                        title="Decrease stock"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className={`stock-value ${product.stock === 0 ? 'out-of-stock' : product.stock <= 5 ? 'low-stock' : ''}`}>
                        {product.stock}
                      </span>
                      <button 
                        className="stock-btn plus"
                        onClick={() => handleQuickStockUpdate(product._id, product.stock + 1)}
                        title="Increase stock"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    {product.featured ? (
                      <span className="badge badge-gold">Yes</span>
                    ) : (
                      <span className="text-gray">No</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit"
                        onClick={() => openEditModal(product)}
                        title="Edit"
                      >
                        <FiEdit2 size={20} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="product-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <CustomSelect
                    value={formData.category}
                    onChange={(e) => handleChange({ target: { name: 'category', value: e.target.value } })}
                    options={categories.map((cat) => ({
                      value: cat,
                      label: cat.charAt(0).toUpperCase() + cat.slice(1)
                    }))}
                    placeholder="Select Category"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    Featured Product
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URLs</label>
                {formData.images.map((img, index) => (
                  <div key={index} className="image-input-row">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.images.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-image"
                        onClick={() => removeImageField(index)}
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-image-btn"
                  onClick={addImageField}
                >
                  + Add Another Image
                </button>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
