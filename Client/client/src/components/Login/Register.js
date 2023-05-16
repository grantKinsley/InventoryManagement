import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const baseURL = "http://localhost:8000/auth/register";

const Register = () => {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        baseURL,
        JSON.stringify({ username: user, password: pwd, companyName: companyName, email: email}),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // console.log(JSON.stringify({ username: user, password: pwd }));
      console.log(response);
      const token = response?.data?.token;
      console.log(token);
      sessionStorage.setItem("serverToken", token);
      if (token) {
        setUser("");
        setPwd("");
        navigate("/");
      }
      //clear state and controlled inputs
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 409) {
        console.log("Username Taken");
        alert("Username Taken")
      } else {
        console.log("Registration Failed");
      }
    }
  };

  return (
    <div className="full-page-container">
      <div className="header" style={{ height: 100 }}></div>
      <div className="login-wrapper">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Email</p>
            <input type="email" onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            <p>Username</p>
            <input type="text" onChange={(e) => setUser(e.target.value)} />
          </label>
          <label>
            <p>Password</p>
            <input type="password" onChange={(e) => setPwd(e.target.value)} />
          </label>
          <label>
            <p>Company Name</p>
            <input
              type="companyName"
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
        <button onClick={() => navigate("/login")}>Login here</button>
      </div>
      <div className="footer" style={{ height: 100 }}></div>
    </div>
  );
};

export default Register;
