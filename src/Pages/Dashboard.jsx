import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseTracker from "./ExpenseTracker";

function Dashboard(){

    const navigate = useNavigate();

    const goToForm = () =>{
        navigate("/login_test");
    }

    const toExpenseForm = () =>{
        navigate("/ExpenseForm");
    }

    return(
        <Fragment>
            <div>Welcome to the Dashboard!</div>
            <button onClick={() => goToForm()}>Go back to login</button>
            <button onClick={() => toExpenseForm()}>Expense Test</button>
            <ExpenseTracker/>
        </Fragment>
    );
}

export default Dashboard