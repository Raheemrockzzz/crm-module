import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Customer from './pages/Customer';
import Engineer from './pages/Engineer';
import NotFound from './pages/NotFound';
import RequireAuth from './components/RequireAuth';
import Unauth from './pages/Unauthorized';
//1st week: login//signup page=> for 3 types of users
//1. UI 2. API Integration 3. Final flow

// 3 types of users:
// Admin: Log in, all tickets, all users->give permisions to the user
// Engineer: signup, login after approval, eidt tickets that are assigned
// Customer: signup, login, raise the ticket, edit the ticket status
const ROLES = {
  'CUSTOMER': 'CUSTOMER',
  'ADMIN': 'ADMIN',
  'ENGINEER': 'ENGINEER'
}
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/*Ptotected routes by require auth starts */}
        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.ENGINEER]} />}>
          <Route path="/engineer" element={<Engineer />} />
        </Route>
        <Route element={<RequireAuth allowedRoles= {[ROLES.CUSTOMER]} />}>
          <Route path="/customer" element={<Customer />} />
        </Route>
        {/*Ptotected routes by require auth end */}
        <Route path="/*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauth />} />
      </Routes>
    </Router>
  )
}

export default App