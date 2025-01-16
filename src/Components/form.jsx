/* eslint-disable react/no-unescaped-entities */
import "react";
import  { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../images/trackify.png';
import { FaFingerprint, FaRegEye, FaEyeSlash   } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import axios from "axios";


function Form(){
    
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
                email: Email.trim(),
                password: password.trim(),
            };
        
            const url = "https://localhost:44351/api/Auth/Login";  // Adjust the URL as per your API endpoint
        
            try {
                const result = await axios.post(url, data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
        
                console.log("Response:", result.data);
        
                // Check if the response has a message and a token (successful login)
                if (result.data.message === "Login Successful") {
                    // Optionally store the token in local storage/session storage if you need to persist it
                    localStorage.setItem('authToken', result.data.token);
                    localStorage.setItem('userName', result.data.userName);
                    localStorage.setItem('userEmail', result.data.userEmail);
                    // Example after login
                    console.log("User email stored in localStorage:", localStorage.getItem("userEmail"));
                    console.log("Login Response:", result.data);

                    navigate("/Dashboard");
                } else {
                    alert(`Error: ${result.data.message}`);  // Show message in case of an error or unsuccessful login
                }
        
            } catch (error) {
                console.error("Full Error Object:", error);
        
                if (error.response) {
                    // Check if the error is an object with a message
                    if (error.response.data && error.response.data.message) {
                        alert(`Error: ${error.response.data.message}`);
                    } else {
                        alert(`Error: ${JSON.stringify(error.response.data)}`);
                    }
                } else if (error.request) {
                    console.error("Error Request:", error.request);
                    alert("Network error, please try again.");
                } else {
                    console.error("General Error:", error);
                    alert("An error occurred.");
                }
            }
        };
        
        
        

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () =>{
        setShowPassword(!showPassword);

    }

    return(
        <Fragment>
        <div className="w-full h-screen flex items-center justify-center">
            <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-black flex-col flex items-center gap-3 rounded-xl shadow-green-500 shadow-lg">
                <img src={Logo} alt="logo" className="w-12 md:w-20"/>
                <h1 className="text-lg md:text-xl font-semibold text-green-500">Welcome Back</h1>
                <p className="text-xs md:text-sm text-gray-500 text-center">Don't have an account? <span className="text-white">Sign Up</span></p>

                <div className="w-full flex flex-col gap-3">
                    <div className="w-full flex items-center bg-gray-800 p-2 rounded-xl gap-2">
                        <MdAlternateEmail className="text-white"/>
                        <input 
                        type="email" 
                        placeholder="Email account" 
                        className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-white"
                        onChange={(e) => handelEmailChange(e.target.value)}/>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <div className="w-full flex items-center bg-gray-800 p-2 rounded-xl gap-2 relative">
                        <FaFingerprint className="text-white"/>
                        <input type={showPassword ? "text" : "password"}  placeholder="Password" className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-white" 
                        onChange={(e) => handelPasswordChange(e.target.value)}/>
                            {showPassword ? (
                                <FaEyeSlash className="absolute right-5 cursor-pointer text-green-500" onClick={togglePasswordVisibility}/>) :
                                (
                                    <FaRegEye className="absolute right-5 cursor-pointer text-green-500" onClick={togglePasswordVisibility}/>
                                )}
                    </div>
                </div>
                <button 
                className="w-full P-2 bg-gray-600 text-black rounded-xl mt-3 hover:bg-green-600 hover:text-white text-sm md:text-base pt-4 pb-4"
                onClick={() => handelLogin()}>
                    Log In
                </button>
            </div>
        </div>
    </Fragment>
    );
}

export default Form