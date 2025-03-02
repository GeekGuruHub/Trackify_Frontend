import axios from "axios";
import  { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

function LoginTest() {
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handelEmailChange = (value) => {
        setEmail(value);
    };

    const handelPasswordChange = (value) => {
        setPassword(value);
    };

    const handelLogin = async () => {
        const data = {
            email: Email,
            password: password,
        };

        const url = "https://localhost:44351/api/connectDB/Login";  // Adjust the URL as per your API endpoint

        try {
            const result = await axios.post(url, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if(result.data === "Login Successful"){
                navigate("/Dashboard");
            }
            console.log("Response:", result.data);
            alert(result.data);
            
        } catch (error) {
            if (error.response) {
                console.error("Error Response:", error.response);
                alert(`Error: ${error.response.data}`);
            } else {
                console.error("Error:", error);
                alert("An error occurred.");
            }
        }
    };

    return (
        <Fragment>
            <div className="h1"><Header/>
            </div>
        
            <div className="wrapper">
                <div className="loginDetails">
                    <div>Login Test</div>
                    <label>Email: </label>
                    <input type="text" id="txtEmail" placeholder="Email" onChange={(e) => handelEmailChange(e.target.value)} /><br></br>
                    <label>Password: </label>
                    <input type="password" id="txtPassword" placeholder="Password" onChange={(e) => handelPasswordChange(e.target.value)}></input><br />
                    <br /><br />
                    <button onClick={() => handelLogin()}>Login!</button>
                </div>
            </div>
        
            
    
        </Fragment>
    );
}

export default LoginTest;
