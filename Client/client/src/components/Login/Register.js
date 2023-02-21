import { useRef, useState, useEffect, useContext } from "react";
import Login from "./Login.js"
import axios from "axios";
import { useNavigate } from "react-router-dom";


const baseURL = "http://localhost:8000/auth/register";

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    const USER_REGEX = /^\[A-z\][A-z0-9-_]{3,23}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const v1 = USER_REGEX.test(user);
        // const v2 = PWD_REGEX.test(pwd);
        // if (!v1 || !v2) {
         // console.log("Invalid Entry");
         // return;
        // }
      
        try {
          const response = await axios.post(
            baseURL,
            JSON.stringify({ username: user, password: pwd }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          setSuccess(true);
          console.log("Success");
          //clear state and controlled inputs
          setUser("");
          setPwd("");
          setMatchPwd("");
        } catch (err) {
          if (!err?.response) {
            console.log("No Server Response");
          } else if (err.response?.status === 409) {
            console.log("Username Taken");
          } else {
            console.log("Registration Failed");
          }
        }
    };

    return(
        <div className="login-wrapper">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label>
              <p>Username</p>
              <input type="text" onChange={e => setUser(e.target.value)} />
            </label>
            <label>
              <p>Password</p>
              <input type="password" onChange={e => setPwd(e.target.value)} />
            </label>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
          <button onClick={() => navigate("/login")}>Login here</button>
        </div>
    );
  };
  
  export default Register;