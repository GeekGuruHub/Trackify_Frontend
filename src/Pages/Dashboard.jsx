import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../Components/ExpenseForm";

function Dashboard(){

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('authToken');
        navigate('/form'); // Redirect user to the login page
    };
    
    const userName = localStorage.getItem("userName");

    return(
        <Fragment>
            <div>Welcome,{userName}!</div>
            
            <br/>
            <ExpenseForm/>

            <br/>

            <div>
                <button onClick={handleLogout}>Log Out</button>
            </div>
        </Fragment>
    );
}

export default Dashboard