import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/signin.css'

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after login


  
  const login = async (event) => {
    event.preventDefault();
  
    const datas = { email, password };
    console.log("Login credentials:", datas);
  
    try {
      const response = await fetch("http://localhost:3005/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      });
  
      if (response.ok) {
        const parsed_response = await response.json();
        console.log("Parsed Response:", parsed_response);
  
        const data = parsed_response.data;
        console.log("Data to save:", data);
  
        // Save to localStorage
        localStorage.setItem("Data", JSON.stringify(data));  // Ensure the token is saved here
  
        const user_type = data.user_type._id;
        alert(parsed_response.message);
  
        if (user_type === "673d6d56751d8f9abf59f6fc") {
          navigate("/adminpage"); 
        } else if (user_type === "673d6e73751d8f9abf59f6ff") {
          navigate("/add"); 
        } else {
          navigate("/home"); 
        }
      } else {
        const parsed_response = await response.json();
        console.log("Error message:", parsed_response.message);
        setError(parsed_response.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("An error occurred while trying to login. Please try again.");
    }
  };

  
  

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={login} method="POST">
          <div><span className="login-txt">Login</span></div>
          <div className="form-row">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="clienterr" id="email-err"></span>
          </div>
          <div className="form-row">
            <input
              type="password"
              name="password"
              id="pass"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="clienterr" id="pass-err"></span>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="login-btn">
            <button className="login-btn">Login</button>
          </div>
          <div className="line">
            <div className="or"><span>OR</span></div>
          </div>
          <div className="pass">
            <div className="new-use">
              <a href="/signup">Create new account</a>
            </div>
            <div className="forgot-pass">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
