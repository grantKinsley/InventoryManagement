import { useState } from "react";
import { useNavigate  } from "react-router-dom";
import axios from "axios";

const baseURL = "http://localhost:8000/auth/login";

const Login = () => {
    const [usr, setUserName] = useState();
    const [pwd, setPassword] = useState();
    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate(); 

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post(
                baseURL,
                JSON.stringify({ username: usr, password: pwd }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setSuccess(true);
            setUserName("");
            setPassword("");
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            }
        }
        
    };

    return(
        <div className="login-wrapper">
          <h1>Please Log In</h1>
          <form onSubmit={handleSubmit}>
            <label>
              <p>Username</p>
              <input type="text" onChange={e => setUserName(e.target.value)} />
            </label>
            <label>
              <p>Password</p>
              <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
          <button onClick={() => navigate("/register")}>Register here</button>
        </div>
      )
}

export default Login;