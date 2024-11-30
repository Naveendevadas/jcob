import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    // You may want to add an image input field here as well
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle input changes and update the state accordingly
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle form submission to send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!product.name || !product.description || !product.price || !product.category) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      // Sending data to backend via POST request
      const response = await axios.post('http://localhost:5000/api/products', product); // Change URL to match your API endpoint

      if (response.data.success) {
        setMessage('Product added successfully!');
        setProduct({ name: '', description: '', price: '', category: '' });
      } else {
        setMessage('Failed to add product.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while adding the product.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Add Product</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Category:</label>
          <select
            name="category"
            value={product.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Books">Books</option>
          </select>
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
