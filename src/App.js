import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Customer from './pages/Customer';
import Engineer from './pages/Engineer';
import NotFound from './pages/NotFound';
//1st week: login//signup page=> for 3 types of users
//1. UI 2. API Integration 3. Final flow

// 3 types of users:
// Admin: Log in, all tickets, all users->give permisions to the user
// Engineer: signup, login after approval, eidt tickets that are assigned
// Customer: signup, login, raise the ticket, edit the ticket status

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element  ={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/engineer" element={<Engineer />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App