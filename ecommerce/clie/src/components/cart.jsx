import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./css/Cart.css";
import NavBar from "./nav";
import Footer from "./footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = "http://localhost:3005"; // Replace with your backend URL

  useEffect(() => {
    const fetchCartItems = async () => {
      const tokenData = localStorage.getItem("Data");
  
      if (!tokenData) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }
  
      // Extract token from the saved user data
      const token = JSON.parse(tokenData).token;
  
      try {
        const response = await axios.get(`${backendUrl}/viewCart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data?.items) {
          setCartItems(response.data.items);
        } else {
          setError("Failed to fetch cart items.");
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("Data");  // Clear user data
          navigate("/signin");  // Redirect to login
        } else {
          setError("Error fetching cart data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, []);
  

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="cart-container">
        <h1>Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-grid">
            {cartItems.map((item) => (
                
        <div key={item.productId._id} className="cart-item">
        <Link to={`/product/${item.productId._id}`} className="cart-item-image-link">
          {item.productId.images && item.productId.images.length > 0 ? (
            <img
              src={`http://localhost:3005/${item.productId.images[0].url.replace(/\\/g, "/")}`}
              alt={item.productId.name}
              className="cart-item-image"
            />
          ) : (
            <img
              src="https://via.placeholder.com/150"
              alt="Placeholder"
              className="cart-item-image"
            />
          )}
        </Link>
        <div className="cart-item-info">
          <h2>{item.productId.name}</h2>
          <p>
            <strong>Price:</strong> ${item.productId.price}
          </p>
          <p>
            <strong>Quantity:</strong> {item.quantity}
          </p>
        </div>
      </div>
      
            
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
