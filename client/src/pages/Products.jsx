import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import CustomSelect from '../components/common/CustomSelect';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import './Products.css';

/**
 * Products listing page with filters
 */
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || '',
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'clips', label: 'Clips' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'accessories', label: 'Accessories' },
  ];

  const sortOptions = [
    { value: '', label: 'Latest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: 'popular', label: 'Most Popular' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const response = await productAPI.getAll(params);
      setProducts(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
      search: '',
    });
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  // Handle body scroll lock when filter is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add('filter-open');
    } else {
      document.body.classList.remove('filter-open');
    }
    return () => document.body.classList.remove('filter-open');
  }, [isFilterOpen]);

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
        <div className="container">
          <h1>Shop All</h1>
          <p>Discover our collection of elegant jewelry and accessories</p>
        </div>
      </div>

      <div className="container">
        <div className="products-layout">
          {/* Mobile Filter Overlay */}
          <div 
            className={`sidebar-overlay ${isFilterOpen ? 'active' : ''}`}
            onClick={() => setIsFilterOpen(false)}
          />
          
          {/* Sidebar Filters - Desktop */}
          <aside className={`products-sidebar ${isFilterOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className="clear-filters" onClick={clearFilters}>
                  Clear All
                </button>
              )}
              <button 
                className="sidebar-close"
                onClick={() => setIsFilterOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Category</h4>
              <div className="filter-options">
                {categories.map((cat) => (
                  <label key={cat.value} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === cat.value}
                      onChange={() => handleFilterChange('category', cat.value)}
                    />
                    <span className="radio-mark"></span>
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="form-input"
                />
                <span className="price-separator">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </aside>

          {/* Products Main */}
          <main className="products-main">
            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="toolbar-left">
                <button 
                  className="filter-toggle btn btn-outline"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <FiFilter size={16} />
                  Filters
                </button>
                {filters.search && (
                  <span className="search-term">
                    Results for "{filters.search}"
                  </span>
                )}
              </div>
              <div className="toolbar-right">
                <span className="product-count">
                  {pagination.total || 0} products
                </span>
                <div className="sort-select-wrapper">
                  <CustomSelect
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    options={sortOptions}
                    placeholder="Sort By"
                    className="sort-select"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="active-filters">
                {filters.category && (
                  <span className="active-filter">
                    {filters.category}
                    <button onClick={() => handleFilterChange('category', '')}>
                      <FiX size={14} />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="active-filter">
                    ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                    <button onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }}>
                      <FiX size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="products-grid grid-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="product-skeleton"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="products-grid grid-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    className={`pagination-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                    onClick={() => handleFilterChange('page', i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
