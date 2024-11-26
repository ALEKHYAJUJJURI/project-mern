// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Us, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Signup from './pages/Signup';
import { DeleteFun } from './pages/Delete';

import { UserProvider } from './context/UserContext';


const ProtectedRoute = ({ role, children }) => {
  const userRole = localStorage.getItem('role');
  console.log(userRole)
  const tokens = localStorage.getItem('token')
  const refreshToken=localStorage.getItem('refreshToken')

if(!tokens && !refreshToken){
  return <Navigate to='/login' />
}
if(role && userRole !== role){
   return <Navigate to="/login"/>
}
return children
};

function App() {
  return (
   <UserProvider>
     <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/signup' element={<Signup/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/seller-dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
         <Route path='/delete/:id' element={<DeleteFun/>} />       
      </Routes>
    </Router>
   </UserProvider>
  );
}

export default App;

