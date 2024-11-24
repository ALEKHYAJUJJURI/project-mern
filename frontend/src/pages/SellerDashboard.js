// pages/SellerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', image: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products uploaded by the seller
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/seller/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or update a product
  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `/api/seller/products/${editingProduct._id}`
        : '/api/seller/products';
      const method = editingProduct ? 'put' : 'post';

      const response = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((product) => (product._id === response.data._id ? response.data : product))
        );
      } else {
        setProducts((prev) => [...prev, response.data]);
      }

      setFormData({ title: '', description: '', price: '', image: '' });
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/seller/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Edit a product
  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <form onSubmit={saveProduct}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Product Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Product Description"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="Image URL"
          required
        />
        <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
      </form>

      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <img src={product.image} alt={product.title} width="100" />
            <button onClick={() => editProduct(product)}>Edit</button>
            <button onClick={() => deleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SellerDashboard;
