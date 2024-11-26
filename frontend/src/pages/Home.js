import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [users,setUsers] = useState({})
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState(3); // Example: Replace with dynamic cart count

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
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
function handleLogOut(){
  if(!localStorage.getItem('user') && !localStorage.getItem('token') && !localStorage.getItem('refreshToken')){
    navigate('/login')
  }else{
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
 
}
  // Navbar Menu for the profile section
  const profileMenu = (
    <Menu>
      <Menu.Item key="1">
        <Button onClick={()=>navigate('/login')}>
          <UserOutlined/> {users.name}Profile
        </Button>
      </Menu.Item>
      <Menu.Item key="2" danger>
        <Button onClick={handleLogOut}>
          <LogoutOutlined /> Log Out
        </Button>
      </Menu.Item>
    </Menu>

  );
function addToCart(){
  
  if(!localStorage.getItem('user') && !localStorage.getItem('token') && !localStorage.getItem('refreshToken')){
    navigate('/signup')
  }
  else {
   
      setUsers(JSON.parse(localStorage.getItem('user')))
      navigate('/cart')
    
  }

}
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Navbar Section */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#001529',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
        }}
      >
        <div className="logo">
          <Link to="/" style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
            <img
              src="/logo.png" // Replace with your logo path
              alt="Logo"
              style={{ height: '40px', marginRight: '10px' }}
            />
            
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
                style={{ border: 'none' }}
              />
            </Link>
          </Badge>
          <Dropdown overlay={profileMenu} placement="bottomRight" trigger={['click']}>
            <Button shape="circle" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>

      {/* Content Section */}
      <Content style={{ padding: '20px 10px', backgroundColor: '#f9f9f9' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#1890ff', fontSize: '24px' }}>
            Welcome 
          </Title>
          <Paragraph style={{ color: '#595959', fontSize: '16px' }}>
            Discover the best products from a variety of categories. Use the filters below to find
            exactly what you need!
          </Paragraph>
        </div>

        {/* Filters Section */}
        <div className="search-filter-container" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="large"
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
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
            <Col xs={24} sm={12} md={4}>
              <Button
                type="primary"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                }}
                size="large"
                block
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
            <Row gutter={[16, 16]} justify="center">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.title}
                          src={product.image} width={200} height={250}
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
                      <div style={{ marginTop: '10px',display:'flex' }}>
                        <Link to={`/product/${product._id}`}>
                          <Button type="primary" block>
                            View Details
                          </Button>
                        </Link>
                        <Button style={{marginLeft:'20px'}} onClick={addToCart}>Add Cart</Button>
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
