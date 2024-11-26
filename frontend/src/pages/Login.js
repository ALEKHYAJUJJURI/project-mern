import React, { createContext, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



const Login = () => {
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
  
    setLoading(true);
    const { email, password } = values;

    try {
      
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password })
      
        console.log(response)
      if (response.status === 200){
        console.log(response.data.user.role)
        
        notification.success({
          message: 'Login Successful',
          description: 'You have logged in successfully!',
        })
        console.log(response)
        // Save the token in localStorage (or context)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken',response.data.refreshToken)
        console.log(response.data.token)
        localStorage.setItem('role',response.data.user.role)

        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Redirect based on role
       if (response.data.user.role === 'admin') {
        navigate('/admin-dashboard');
        } else 
        if (response.data.user.role === 'seller') {
          navigate('/seller-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }
    
      
      }
     catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Login</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email format' }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Login
          </Button>
        </Form.Item>
        New User? <Link to='/signup'>Sign up</Link>
      </Form>
    </div>
  );
};

export default Login;
