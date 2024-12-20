import React from "react";
import { Link,useNavigate  } from "react-router-dom";
import '../CSS/nav.css'

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/signin"); // Redirect to login after logout
      };
    
    return(
        <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          Shoe<span className="highlight">Mart</span>
        </div>

        {/* Links */}
        <div className={`menu ${isMenuOpen ? "open" : ""}`}>
          <Link className="menu-item">
            
          </Link>
          <Link  className="menu-item">
        
          </Link>
          <Link className="menu-item">
          
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
    )
}
export default Navbar