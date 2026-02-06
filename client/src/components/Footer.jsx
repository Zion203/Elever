import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiMail } from 'react-icons/fi';
import './Footer.css';

/**
 * Elegant footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div id="footer-main" className="footer-main container">
        {/* Brand Column */}
        <div className="footer-brand">
          <a href="/" className="footer-logo">
            <img src="/logo.png" alt="Elever" />
          </a>
          <p className="footer-tagline">
            Elevate your style with our curated collection of elegant earrings 
            and fashion accessories.
          </p>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FiFacebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiTwitter size={20} />
            </a>
            <a href="mailto:hello@elever.com" aria-label="Email">
              <FiMail size={20} />
            </a>
          </div>
        </div>

        {/* Links Columns */}
        <div className="footer-links">
          <div className="footer-column">
            <h4 className="footer-heading">Shop</h4>
            <ul>
              <li><Link to="/products?category=earrings">Earrings</Link></li>
              <li><Link to="/products?category=necklaces">Necklaces</Link></li>
              <li><Link to="/products?category=bracelets">Bracelets</Link></li>
              <li><Link to="/products?category=clips">Clips</Link></li>
              <li><Link to="/products?category=accessories">Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Help</h4>
            <ul>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">About</h4>
            <ul>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/sustainability">Sustainability</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4 className="footer-heading">Stay in Touch</h4>
          <p>Subscribe for exclusive offers, new arrivals, and styling tips.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {currentYear} Elever. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="divider"></span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
