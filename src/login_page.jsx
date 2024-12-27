import axios from "axios";
import  { Fragment, useState } from "react";

function Login() {
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
            <div>Login</div>
            <label>Email: </label>
            <input type="text" id="txtEmail" placeholder="Email" onChange={(e) => handelEmailChange(e.target.value)} /><br></br>
            <label>Password: </label>
            <input type="text" id="txtPassword" placeholder="Password" onChange={(e) => handelPasswordChange(e.target.value)}></input><br />
            <br /><br />
            <button onClick={() => handelLogin()}>Login!</button>
        </Fragment>
    );
}

export default Login;
