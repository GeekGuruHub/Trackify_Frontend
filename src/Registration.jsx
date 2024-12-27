import axios from "axios";
import React, {Fragment, useState} from "react";

function Registration(){

    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first_Name, set_firstName] = useState("");
    const [last_name, set_lastname] = useState("");

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
            email: Email,
            password: password,
            first_name: first_Name,
            last_name: last_name,
        };
    
        const url = "https://localhost:44351/api/connectDB/Registration";
        axios.post(url, data)
            .then((result) => {
                alert(result.data);
            })
            .catch((error) => {
                alert(error);
            });
    };
    
    return(
        <Fragment>
            <div>Registration</div>
            <label>Email: </label>
            <input type="text" id="txtEmail" placeholder="Email" onChange={(e) => handelEmailChange(e.target.value)} /><br></br>
            <label>Password: </label>
            <input type="text" id="txtPassword" placeholder="Password" onChange={(e) => handelPasswordChange(e.target.value)}></input><br />
            <label>First Name: </label>
            <input type="text" id="txtFirstName" placeholder="First Name" onChange={(e) => handelFirstNameChange(e.target.value)}/><br />
            <label>Last Name: </label>
            <input type="text" id="txtlastName" placeholder="Last Name" onChange={(e) => handelLastNameChange(e.target.value)}/>
            <br /><br />
            <button onClick={()=> handelSave()}>Register!</button>
        </Fragment>
    );

}

export default Registration