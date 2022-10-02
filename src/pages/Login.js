import React from 'react'
import { useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

// Signup : userid, username, emial,password
// login: email, password 

const Login = () => {
  const [showSignup, setShowSignup] = useState(true);
  const [userType, setUserType]= useState("CUSTOMER");

  const toogleSignup = () => {
    setShowSignup(!showSignup);
  }
  const handleSelect =(e)=>{
setUserType(e);
  }
  return (
    <div className='bg-info vh-100 d-flex justify-content-center align-items-center'>
      <div className="card p-5 rounded-4 shadow-lg" style={{ width: 20 + 'rem' }}>
        <h4 className='text-center text-info'>{showSignup ? 'Sign Up' : 'Log In'}</h4>

        <form>
          <div className="input-group">
            <input type="text" className='form-control m-1' placeholder='User id' />
          </div>
          {
            showSignup &&
            <>
              <div className="input-group">
                <input type="text" className='form-control m-1' placeholder='Username' />
              </div>
              <div className="input-group">
                <input type="email" className='form-control m-1' placeholder='Email' />
              </div>
              <div className='d-flex justify-content-between m-1'>
              <span className='my-1 mx-2'>User Type</span>
                <DropdownButton align="start" title={userType} id="userType" variant="light" onSelect={handleSelect}>
                  <Dropdown.Item eventKey="CUSTOMER">CUSTOMER</Dropdown.Item>
                  <Dropdown.Item eventKey="ENGINEER">ENGINEER</Dropdown.Item>

                </DropdownButton>
              </div>
            </>
          }
          <div className="input-group">
            <input type="password" className='form-control m-1' placeholder='Password' />
          </div>
          <div className="input-group">
            <input type="submit" className='form-control btn btn-info text-white fw-bolder m-1' value={showSignup ? "Sign Up" : "Log In"} />
          </div>

          <div className='m-1 text-primary' onClick={toogleSignup}>
            {showSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
          </div>

        </form>
      </div>

    </div>
  )
}

export default Login