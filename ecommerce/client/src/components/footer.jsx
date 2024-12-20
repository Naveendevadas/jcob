import React from 'react';
import './css/footer.css'; // Import the CSS file for styling
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'; // Importing icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>Your go-to destination for the latest shoe trends and quality footwear. Explore our exclusive collection today!</p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Sale</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: support@Shoemart.com</p>
          <p>Phone: 751-012-1181</p>
          <div className="social-media">
            <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook size={30} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram size={30} /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter size={30} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 ShoeStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
