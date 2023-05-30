import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context-Api/AuthProvider";
import axios from "axios";
import Button from "@mui/material/Button";
import "./Login.css";

// Test Login:
// Username: abc123
// Password: abc123

const baseURL = "http://localhost:8000/auth/login";

const Login = () => {
  const [usr, setUserName] = useState();
  const [pwd, setPassword] = useState();
  const [errMsg, setErrMsg] = useState("");

  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        baseURL,
        JSON.stringify({ username: usr, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const resData = response?.data;
      const resErr = resData.Error;
      const loginAttempts = resData.loginAttempts;
      const resStatus = resData.Status;
      console.log(resData)
      if (resStatus === 402) {  // bad username
        setErrMsg(resErr);
        return;
      } else if (resStatus === 401) { // bad password
        const errMsg = resErr + " You have " + (5 - loginAttempts) + " attempts remaining";
        setErrMsg(errMsg);
        return;
      } else if (resStatus === 403) { // account lockout
        setErrMsg(resErr);
        return;
      }
      const token = response?.data?.token;
      sessionStorage.setItem("serverToken", token); // store token locally
      sessionStorage.setItem("username", usr)
      console.log(token);
      if (token) {
        setAuth({ usr, token });
        setUserName("");
        setPassword("");
        navigate("/");
      } else {
        window.alert("Invalid Username and/or Password");
        console.log("Token not retrieved");
      }
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      }
    }
  };

  return (
    <div className="full-page-container">
      <div className="header" style={{ height: 100 }}></div>
      <div className="login-wrapper">
        <h1 className="login-title">Welcome</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Username</p>
            <input type="text" onChange={(e) => setUserName(e.target.value)} />
          </label>
          <label>
            <p>Password</p>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <div className="invalidText">{errMsg}</div>
          <div>
            <Button type="submit" variant="contained"
             style={{ width: "100%", marginTop: "40px" }}>Submit</Button>
          </div>
          <Button onClick={() => navigate("/register")}>Register</Button>
        </form>
      </div>
      <div className="footer" style={{ height: 100 }}></div>
    </div>
    
  );
};

export default Login;
