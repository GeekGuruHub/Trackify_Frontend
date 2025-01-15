/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import  {Fragment, useState} from "react";
import { useNavigate } from "react-router-dom";
import "react";
import Logo from '../images/trackify.png';
import { FaFingerprint } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";


function RegistrationForm(){

    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first_Name, set_firstName] = useState("");
    const [last_name, set_lastname] = useState("");
    const navigate = useNavigate();

    const handelEmailChange = (value) =>{
        setEmail(value);
    };

    const handelPasswordChange = (value) =>{
        setPassword(value);
    };

    const handelFirstNameChange = (value) =>{
        set_firstName(value);
    };

    const handelLastNameChange = (value) =>{
        set_lastname(value);
    };

    const handelSave = () => {
        const data = {
            email: Email.trim(),
            password: password.trim(),
            first_name: first_Name.trim(),
            last_name: last_name.trim(),
        };
    
        const url = "https://localhost:44351/api/connectDB/Registration";
        axios.post(url, data)
            .then((result) => {
                alert(result.data);
                console.log(result.data);
                if(result.data === "Registered Successfully"){
                    navigate("/Form");
                }
            })
            .catch((error) => {
                alert(error);
            });
    };
    
    return(
            <Fragment>
            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-black flex-col flex items-center gap-3 rounded-xl shadow-green-500 shadow-lg">
                    <img src={Logo} alt="logo" className="w-12 md:w-20"/>
                    <h1 className="text-lg md:text-xl font-semibold text-green-500">Register</h1>    

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
                        <div className="w-full flex items-center bg-gray-800 p-2 rounded-xl gap-2">
                            <FaFingerprint className="text-white"/>
                            <input 
                            type="password" 
                            placeholder="password" 
                            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-white"
                            onChange={(e) => handelPasswordChange(e.target.value)}/>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full flex items-center bg-gray-800 p-2 rounded-xl gap-2">
                            <FaRegUser className="text-white"/>
                            <input 
                            type="text" 
                            placeholder="First name" 
                            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-white"
                            onChange={(e) => handelFirstNameChange(e.target.value)}/>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full flex items-center bg-gray-800 p-2 rounded-xl gap-2">
                            <FaRegUser className="text-white"/>
                            <input 
                            type="text" 
                            placeholder="Last name" 
                            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-white"
                            onChange={(e) => handelLastNameChange(e.target.value)}/>
                        </div>
                    </div>

                    <button 
                className="w-full P-2 bg-gray-600 text-black rounded-xl mt-3 hover:bg-green-600 hover:text-white text-sm md:text-base pt-4 pb-4"
                onClick={() => handelSave()}>
                    Register
                </button>
                </div>
            </div>
        </Fragment>
    );
}

export default RegistrationForm