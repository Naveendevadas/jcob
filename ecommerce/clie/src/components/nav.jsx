import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/signin"); // Redirect to login after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          Shoe<span className="highlight">Mart</span>
        </div>

        {/* Links */}
        <div className={`menu ${isMenuOpen ? "open" : ""}`}>
          <Link to="/mens" className="menu-item">
            Men's
          </Link>
          <Link to="/womens" className="menu-item">
            Women's
          </Link>
          <Link to="/cart" className="menu-item">
            Cart
          </Link>
          <button onClick={handleLogout} className="menu-item logout-btn">
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}
