import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard(){

    const navigate = useNavigate();

    const goToLogin = () =>{
        navigate("/login_test");
    }

    return(
        <Fragment>
            <div>Welcome to the Dashboard!</div>
            <button onClick={() => goToLogin()}>Go back to login</button>
        </Fragment>
    );
}

export default Dashboard