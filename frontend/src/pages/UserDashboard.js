// pages/UserDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'

const { Meta } = Card;

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate()
const [userName,setUserName] = useState({})
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product) => {
    // Add to cart logic
    notification.success({
      message: 'Added to Cart',
      description: `${product.title} has been added to your cart.`,
    });
  };

  useEffect(() => {
    fetchProducts();
    setUserName(JSON.parse(localStorage.getItem("user")))
    console.log(JSON.parse(localStorage.getItem("user")))
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    notification.success({
      message: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
     <div className='d-flex justify-content-between'>
     <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{userName.name} Welcome</h1>
     <Button color="danger" onClick={handleLogout}>Logout</Button>
     </div>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Card
              hoverable
              cover={<img alt={product.title} src={product.image} style={{ height: '200px', objectFit: 'cover' }} />}
              actions={[
                <Button type="primary" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>,
              ]}
            >
              <Meta
                title={product.title}
                description={
                  <>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>${product.price}</p>
                    <p style={{ color: '#888' }}>{product.description}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default UserDashboard;
