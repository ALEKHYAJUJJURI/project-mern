import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, InputNumber, notification, List, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [userName, setUserName] = useState({});
  const navigate = useNavigate()

  // Fetch all products uploaded by the seller
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add a new product
  const saveProduct = async (values) => {
    try {
      const url = 'http://localhost:8080/api/seller/products'; // Always use the POST endpoint for adding new products

      const response = await axios.post(url, values, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      console.log(response.data);

      // Add the new product to the existing list of products
      setProducts((prev) => [...prev, response.data]);

      notification.success({
        message: 'Product Added',
        description: 'Your product has been added successfully.',
      });
    } catch (err) {
      console.error(err);
      notification.error({
        message: 'Error',
        description: 'Something went wrong, please try again later.',
      });
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/seller/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts((prev) => prev.filter((product) => product._id !== id));
      notification.success({
        message: 'Product Deleted',
        description: 'The product has been deleted successfully.',
      });
    } catch (err) {
      console.error(err);
      notification.error({
        message: 'Error',
        description: 'Unable to delete the product. Please try again.',
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    setUserName(JSON.parse(localStorage.getItem('user')));
  }, []);
  function handleLogout(){
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className='m-4'>
      <div>
      <h1>{userName.name} Seller Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
      </div>
      <Form
        onFinish={saveProduct}
        layout="vertical"
        style={{ maxWidth: 600, margin: 'auto', marginBottom: 40 }}
      >
        <Form.Item
          label="Product Title"
          name="title"
          rules={[{ required: true, message: 'Please input the product title!' }]}
        >
          <Input placeholder="Enter product title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the product description!' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter product description" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please input the product price!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="Enter product price"
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          label="Product Image URL"
          name="image"
          rules={[{ required: true, message: 'Please input the product image URL!' }]}
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Add Product
          </Button>
        </Form.Item>
      </Form>

      <h2>Existing Products</h2>
      <div className='d-flex flex-wrap overflow-auto'>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={products}
        renderItem={(product) => (
          <List.Item key={product._id}>
            <Card
              hoverable
              cover={<img alt={product.title} src={product.image} />}
              actions={[
                <Button type="link" onClick={() => deleteProduct(product._id)}>
                  Delete
                </Button>,
              ]}
            >
              <Card.Meta
                title={product.title}
                description={<p>{product.description}</p>}
              />
              <p><strong>${product.price}</strong></p>
            </Card>
          </List.Item>
        )}
      />
      </div>
    </div>
  );
}

export default SellerDashboard;
