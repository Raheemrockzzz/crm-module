import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Login from './pages/Login';
//1st week: login//signup page=> for 3 types of users
//1. UI 2. API Integration 3. Final flow

// 3 types of users:
// Admin: Log in, all tickets, all users->give permisions to the user
// Engineer: signup, login after approval, eidt tickets that are assigned
// Customer: signup, login, raise the ticket, edit the ticket status

const App = () => {
  return (
    <div>
    <Login />
    </div>
  )
}

export default App