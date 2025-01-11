import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard(){

    const navigate = useNavigate();

    const goToLogin = () =>{
        navigate("/login_test");
    }

    const toExpenseTrackerTest = () =>{
        navigate("/ExpenseTracker");
    }

    return(
        <Fragment>
            <div>Welcome to the Dashboard!</div>
            <button onClick={() => goToLogin()}>Go back to login</button>
            <button onClick={() => toExpenseTrackerTest()}>Expense Test</button>
        </Fragment>
    );
}

export default Dashboard