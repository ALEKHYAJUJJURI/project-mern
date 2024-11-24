// pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all sellers
  const fetchSellers = async () => {
    try {
      const response = await axios.get('/api/admin/sellers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSellers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Approve or restrict a seller
  const updateSellerStatus = async (id, action) => {
    try {
      const response = await axios.put(
        `/api/admin/sellers/${id}/approve`,
        { action },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert(response.data.message);
      fetchSellers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSellers();
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Sellers</h2>
        <ul>
          {sellers.map((seller) => (
            <li key={seller._id}>
              {seller.name} ({seller.email}) - {seller.isApproved ? 'Approved' : 'Restricted'}
              <button onClick={() => updateSellerStatus(seller._id, 'approve')}>Approve</button>
              <button onClick={() => updateSellerStatus(seller._id, 'restrict')}>Restrict</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <strong>{product.title}</strong> - ${product.price}
              <p>Seller: {product.sellerId?.name}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;
