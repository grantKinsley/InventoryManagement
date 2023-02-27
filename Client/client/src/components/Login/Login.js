import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context-Api/AuthProvider";
import axios from "axios";

// Test Login:
// Username: abc123
// Password: abc123

const baseURL = "http://localhost:8000/auth/login";

const Login = () => {
  const [usr, setUserName] = useState();
  const [pwd, setPassword] = useState();

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
      const token = response?.data?.token;
      sessionStorage.setItem("serverToken", token); // store token locally
      console.log(token);
      if (token) {
        setAuth({ usr, token });
        setUserName("");
        setPassword("");
        navigate("/");
      } else {
        console.log("Token not retrieved");
      }
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
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
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <button onClick={() => navigate("/register")}>Register here</button>
    </div>
  );
};

export default Login;
