import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./css/style.css";
import NavBar from "./nav";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <><NavBar/>
    <div className="product-details">
      <div className="carousel">
        <div
          className="carousel-inner"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <div key={index} className="carousel-item">
                <img
                  src={`http://localhost:3005/${image.url.replace(/\\/g, "/")}`}
                  alt={image.alt || `Product image ${index + 1}`}
                />
              </div>
            ))
          ) : (
            <div className="carousel-item">No images available</div>
          )}
        </div>
        <button className="carousel-arrow prev" onClick={handlePrevSlide}>
          &#8249;
        </button>
        <button className="carousel-arrow next" onClick={handleNextSlide}>
          &#8250;
        </button>
      </div>


      <div className="carousel-dots">
        {product.images &&
          product.images.map((_, index) => (
            <div
              key={index}
              className={`carousel-dot ${
                currentSlide === index ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
      </div>

      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">
          <strong>Price:</strong> ${product.price}
        </p>
        <p className="product-category">
          <strong>Category:</strong> {product.category}
        </p>
        <p className="product-description">{product.description}</p>
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
