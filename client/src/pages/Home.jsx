import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import './Home.css';

/**
 * Landing page with hero section and featured products
 */
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getFeatured();
      setFeaturedProducts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Earrings', slug: 'earrings', image: '/images/categories/earrings.jpg' },
    { name: 'Necklaces', slug: 'necklaces', image: '/images/categories/necklaces.jpg' },
    { name: 'Bracelets', slug: 'bracelets', image: '/images/categories/bracelets.jpg' },
    { name: 'Accessories', slug: 'accessories', image: '/images/categories/accessories.jpg' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content container">
          <div className="hero-text animate-slide-up">
            <span className="hero-label">New Collection</span>
            <h1 className="hero-title">
              Elevate Your<br />
              <span className="text-gold">Elegance</span>
            </h1>
            <p className="hero-description">
              Discover our curated collection of handcrafted earrings and 
              accessories, designed to complement your unique style.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Collection
                <FiArrowRight />
              </Link>
              <Link to="/products?featured=true" className="btn btn-outline btn-lg">
                View Featured
              </Link>
            </div>
          </div>
          <div className="hero-image animate-fade-in">
            <div className="hero-image-wrapper">
              <div className="hero-image-accent"></div>
              <img 
                src="/images/hero-model.jpg" 
                alt="Woman wearing elegant earrings" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <FiTruck size={24} />
              <div>
                <span className="feature-title">Free Shipping</span>
                <span className="feature-text">On orders over $50</span>
              </div>
            </div>
            <div className="feature-item">
              <FiShield size={24} />
              <div>
                <span className="feature-title">Secure Payment</span>
                <span className="feature-text">100% protected</span>
              </div>
            </div>
            <div className="feature-item">
              <FiRefreshCw size={24} />
              <div>
                <span className="feature-title">Easy Returns</span>
                <span className="feature-text">30 day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Shop by Category</h2>
            <div className="divider divider-center"></div>
            <p>Explore our carefully curated collections</p>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link 
                to={`/products?category=${category.slug}`} 
                key={category.slug}
                className="category-card"
              >
                <div className="category-image">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="category-placeholder" style={{ display: 'none' }}>
                    {category.name.charAt(0)}
                  </div>
                </div>
                <div className="category-overlay">
                  <span className="category-name">{category.name}</span>
                  <span className="category-cta">Shop Now <FiArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">Handpicked for You</span>
            <h2>Featured Products</h2>
            <div className="divider divider-center"></div>
          </div>
          
          {loading ? (
            <div className="loading-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="product-skeleton"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid grid-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray">No featured products available</p>
          )}
          
          <div className="section-cta text-center">
            <Link to="/products" className="btn btn-outline btn-lg">
              View All Products
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="promo-banner">
        <div className="container">
          <div className="banner-content">
            <span className="banner-label">Limited Time Offer</span>
            <h2 className="banner-title">20% Off Your First Order</h2>
            <p className="banner-text">
              Sign up for our newsletter and receive an exclusive discount 
              on your first purchase.
            </p>
            <form className="banner-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="banner-input"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials section">
        <div className="container">
          <div className="section-header text-center">
            <h2>What Our Customers Say</h2>
            <div className="divider divider-center"></div>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "Absolutely stunning pieces! The quality exceeded my expectations. 
                I've received so many compliments on my new earrings."
              </p>
              <div className="testimonial-author">
                <span className="author-name">Sarah M.</span>
                <span className="author-title">Verified Buyer</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "The craftsmanship is impeccable. These are now my go-to everyday 
                earrings. Fast shipping too!"
              </p>
              <div className="testimonial-author">
                <span className="author-name">Emily R.</span>
                <span className="author-title">Verified Buyer</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-text">
                "Elever has the most beautiful collection. I can't stop ordering! 
                Perfect for gifts too."
              </p>
              <div className="testimonial-author">
                <span className="author-name">Jessica T.</span>
                <span className="author-title">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
