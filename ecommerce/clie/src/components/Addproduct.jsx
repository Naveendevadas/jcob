import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/AddProductForm.css';  // Updated import for unique CSS

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    images: [],
    altText: "",
  });
  const [message, setMessage] = useState("");
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("Data");
    if (!storedUserData) {
      console.error("No user data found. Ensure login saves data to localStorage.");
      setMessage("No user data found. Please log in again.");
      return;
    }
    try {
      const parsedData = JSON.parse(storedUserData);
      if (parsedData?._id) {
        setSellerId(parsedData._id);
      } else {
        console.error("Seller ID not found in parsed data.");
        setMessage("Seller ID not found. Please log in again.");
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setMessage("Error retrieving seller data. Please log in again.");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setProductData((prevData) => ({
          ...prevData,
          images: [...prevData.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sellerId = JSON.parse(localStorage.getItem("Data"))._id;
    console.log("sellerId:", sellerId);

    try {
      const response = await fetch(`http://localhost:3005/addProduct/${sellerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        alert(errorResponse.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("An error occurred while submitting the product.");
    }
  };

  return (
    <div className="add-product-unique-container">
      <h2>Add Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Category as Text Input */}
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Alt Text */}
        <div>
          <label>Alt Text (for images):</label>
          <input
            type="text"
            name="altText"
            value={productData.altText}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="img-container">
          <label>Choose Product Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="file-input"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {productData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index}`}
                className="w-16 h-16 object-cover"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
