import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Input,
  Select,
  Button,
  Row,
  Col,
  Card,
  Spin,
  Typography,
  Layout,
  Menu,
  Dropdown,
  Space,
  Badge,
} from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Option } = Select;
const { Title, Paragraph } = Typography;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState(3); // Example: Replace with dynamic cart count

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products];

      if (search) {
        filtered = filtered.filter((product) =>
          product.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (category) {
        filtered = filtered.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [search, category, products]);

  // Navbar Menu for the profile section
  const profileMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile">
          <UserOutlined /> Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="2" danger>
        <Link to="/logout">
          <LogoutOutlined /> Log Out
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Navbar Section */}
      <Header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#001529' }}>
        <div className="navbar-container" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo" style={{ flex: 1 }}>
            <Link to="/" style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
              <img
                src="/logo.png" // Replace with your logo path
                alt="Logo"
                style={{ height: '40px', marginRight: '10px' }}
              />
              Marketplace
            </Link>
          </div>
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/signup">
              <Button type="link" style={{ color: '#fff' }}>
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button type="link" style={{ color: '#fff' }}>
                Login
              </Button>
            </Link>
            <Badge count={cartItems} offset={[10, 0]} showZero>
              <Link to="/cart">
                <Button
                  shape="circle"
                  icon={<ShoppingCartOutlined />}
                  style={{ color: '#fff', border: 'none' }}
                />
              </Link>
            </Badge>
            <Dropdown overlay={profileMenu} placement="bottomRight" trigger={['click']}>
              <Button shape="circle" icon={<UserOutlined />} style={{ color: '#fff' }} />
            </Dropdown>
          </div>
        </div>
      </Header>

      {/* Content Section */}
      <Content style={{ padding: '40px 20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={2} style={{ color: '#1890ff' }}>
            Welcome to Our Marketplace
          </Title>
          <Paragraph style={{ color: '#595959' }}>
            Discover the best products from a variety of categories. Use the filters below to find
            exactly what you need!
          </Paragraph>
        </div>

        {/* Filters Section */}
        <div className="search-filter-container" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Input
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Select category"
                style={{ width: '100%' }}
                value={category}
                onChange={(value) => setCategory(value)}
                size="large"
                allowClear
              >
                <Option value="">All Categories</Option>
                <Option value="electronics">Electronics</Option>
                <Option value="clothing">Clothing</Option>
                <Option value="books">Books</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Button
                type="primary"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                }}
                size="large"
                style={{ width: '100%' }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </div>

        {/* Products Section */}
        <div className="products-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" tip="Loading Products..." />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.title}
                          src={product.image}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      }
                      style={{ borderRadius: '8px', overflow: 'hidden' }}
                    >
                      <Card.Meta
                        title={
                          <Typography.Text strong style={{ fontSize: '16px' }}>
                            {product.title}
                          </Typography.Text>
                        }
                        description={
                          <Typography.Text style={{ color: '#595959' }}>
                            ${product.price.toFixed(2)}
                          </Typography.Text>
                        }
                      />
                      <div style={{ marginTop: '10px' }}>
                        <Link to={`/product/${product._id}`}>
                          <Button type="primary" block>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Typography.Text type="warning">
                      No products found matching your filters.
                    </Typography.Text>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
