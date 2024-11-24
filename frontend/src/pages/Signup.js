import React, { useState } from 'react';
import { Form, Input, Button, Select, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState('user'); // Default role is 'user'

  const handleSubmit = async (values) => {
    setLoading(true);
    const { name, email, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      notification.error({
        message: 'Password mismatch',
        description: 'The passwords you entered do not match.',
      });
      setLoading(false);
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
    };

    try {
      // Send the signup request to the backend
      const response = await axios.post('http://localhost:8080/api/auth/signup', userData);
      if (response.status === 201) {
        notification.success({
          message: 'Signup Successful',
          description: 'You have successfully signed up! Please log in.',
        });
        navigate('/login'); // Redirect to login page after successful signup
      }
    } catch (error) {
      notification.error({
        message: 'Signup Failed',
       // description: error.response.data.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container" style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Create an Account</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        {/* Name Field */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        {/* Confirm Password Field */}
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: 'Please confirm your password!' }]}
          hasFeedback
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>

        {/* Role Selection */}
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select your role!' }]}
        >
          <Select value={role} onChange={setRole}>
            <Option value="user">User</Option>
            <Option value="seller">Seller</Option>
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Signup;
