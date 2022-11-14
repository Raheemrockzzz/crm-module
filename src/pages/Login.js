import React from "react";
import { useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userSignin, userSignup } from "../api/auth";

// Signup : userid, username, emial, usertype, password
// login: email, password

// POST API
/*
1. Grab the data from the input box
2. store the data: for singup username, email
3. call the api (send the stored data to API)
 */

const Login = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [userType, setUserType] = useState("CUSTOMER");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const updateSigupData = (e) => {
    if (e.target.id === "userid") {
      setUserId(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    } else if (e.target.id === "name") {
      setName(e.target.value);
    } else if (e.target.id === "email") {
      setEmail(e.target.value);
    }
  };

  const singupFn = (e) => {
    /*
    1. prevent default
    2. data: userid, username,email, password, userType
    3. call the api and pass data
    4. display the successful message
    */
    e.preventDefault();

    const data = {
      userId: userId,
      name: name,
      email: email,
      password: password,
      userType: userType,
    };

    userSignup(data)
      .then((response) => {
        console.log(response);

        setStatus(
          `${response.data.userTypes} Signup  ${response.request.statusText} Successfully!!`
        );
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
    console.log("Signup button is triggered");
  };

  const loginFn = (e) => {
    e.preventDefault();

    const data = {
      userId: userId,
      password: password,
    };

    userSignin(data)
      .then((response) => {
        // setname(name,value)
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("userTypes", response.data.userTypes);
        localStorage.setItem("userStatus", response.data.userStatus);
        localStorage.setItem("token", response.data.accessToken);

        if (response.data.userTypes === "CUSTOMER") {
          navigate("/customer");
          // window.location.href = "/customer";
        } else if (response.data.userTypes === "ENGINEER") {
          navigate("/engineer");
          // window.location.href ="/engineer";
        } else if (response.data.userTypes === "ADMIN") {
          navigate("/admin");
          // window.location.href="/admin"
        } else {
          navigate("/");
          // window.location.href = "/";
        }
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };
  // const updateUserTypes = (e) => {
  //   setUserType(e);
  // };

  const toogleSignup = () => {
    setShowSignup(!showSignup);
    setStatus("");
    setMessage("");
    // setUserId("");
    setEmail("");
    setName("");
    // setPassword("");
  };
  const handleSelect = (e) => {
    setUserType(e);
  };

  return (
    <div className="bg-info vh-100 d-flex justify-content-center align-items-center">
      <div
        className="card p-5 rounded-4 shadow-lg"
        style={{ width: 20 + "rem" }}
      >
        <h4 className="text-center text-info">
          {showSignup ? "Sign Up" : "Sign In"}
        </h4>

        <form onSubmit={showSignup ? singupFn : loginFn}>
          <div className="input-group">
            <input
              type="text"
              className="form-control m-1"
              placeholder="User id"
              value={userId}
              onChange={updateSigupData}
              id="userid"
            />
          </div>
          {showSignup && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control m-1"
                  placeholder="Username"
                  value={name}
                  onChange={updateSigupData}
                  id="name"
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control m-1"
                  placeholder="Email"
                  value={email}
                  onChange={updateSigupData}
                  id="email"
                />
              </div>
              <div className="d-flex justify-content-between m-1">
                <span className="my-1 mx-2">User Type</span>
                <DropdownButton
                  align="end"
                  title={userType}
                  id="userType"
                  variant="light"
                  // value={userType}
                  onSelect={handleSelect}
                >
                  <Dropdown.Item eventKey="CUSTOMER">CUSTOMER</Dropdown.Item>
                  <Dropdown.Item eventKey="ENGINEER">ENGINEER</Dropdown.Item>
                </DropdownButton>
              </div>
            </>
          )}
          <div className="input-group">
            <input
              type="password"
              className="form-control m-1"
              placeholder="Password"
              value={password}
              onChange={updateSigupData}
              id="password"
            />
          </div>
          <div className="input-group">
            <input
              type="submit"
              className="form-control btn btn-info text-white fw-bolder m-1"
              value={showSignup ? "Sign Up" : "Sign In"}
            />
          </div>

          <div
            className="m-1 text-center text-primary clickable"
            onClick={toogleSignup}
          >
            {showSignup
              ? "Already have an account? Login"
              : "Don't have an account? Signup"}
          </div>
        
          <div className="text-center text-danger">{message}</div>
          <div className="text-center fw-bolder text-success">{status}</div>
        </form>
      </div>
    </div>
  );
};

export default Login;
