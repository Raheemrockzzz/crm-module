import React from 'react'
import { useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { userSignin } from '../api/auth';

// Signup : userid, username, emial,password
// login: email, password

// POST API
/*
1. Grab the data from the input box
2. store the data
3. call the api (send the stored data to API)
 */

const Login = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [userType, setUserType] = useState("CUSTOMER");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const updateSigupData = (e) => {
    if (e.target.id === 'userid') {
      setUserId(e.target.value);
    }
    else if (e.target.id === "password") {
      setPassword(e.target.value);
    }
  }
  const singupFn = () => {
    console.log("Signup button is triggered")
  }

  const loginFn = (e) => {
    e.preventDefault();

    const data = {
      userId: userId,
      password: password,
    }
    userSignin(data).then((response) => {
      // setname(name,value)
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("userTypes", response.data.userTypes);
      localStorage.setItem("userStatus", response.data.userStatus);
      localStorage.setItem("token", response.data.accessToken);
      
      if(response.data.userTypes === "CUSTOMER")
      {
        window.location.href = "/customer";
      }
      else if (response.data.userTypes === "ENGINEER")
      {
        window.location.href ="/engineer";   
      }
      else if (response.data.userTypes === "ADMIN"){
        window.location.href="/admin"
      }
      else{
        window.location.href = "/";
      }

    }).catch((error) => {
      console.log(error);
    })
  }


  const toogleSignup = () => {
    setShowSignup(!showSignup);
  }
  const handleSelect = (e) => {
    setUserType(e);
  }
  return (
    <div className='bg-info vh-100 d-flex justify-content-center align-items-center'>
      <div className="card p-5 rounded-4 shadow-lg" style={{ width: 20 + 'rem' }}>
        <h4 className='text-center text-info'>{showSignup ? 'Sign Up' : 'Log In'}</h4>

        <form onSubmit={showSignup ? singupFn : loginFn}>
          <div className="input-group">
            <input type="text" className='form-control m-1' placeholder='User id' value={userId} onChange={updateSigupData} id="userid" />
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
                <DropdownButton align="end" title={userType} id="userType" variant="light" onSelect={handleSelect}>
                  <Dropdown.Item eventKey="CUSTOMER">CUSTOMER</Dropdown.Item>
                  <Dropdown.Item eventKey="ENGINEER">ENGINEER</Dropdown.Item>

                </DropdownButton>
              </div>
            </>
          }
          <div className="input-group">
            <input type="password" className='form-control m-1' placeholder='Password' value={password} onChange={updateSigupData} id="password" />
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

export default Login;