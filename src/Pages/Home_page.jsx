import { useNavigate } from 'react-router-dom';



export default function HomePage(){

    const navigate = useNavigate();

    const goToLogin = () =>{
        navigate("/login_test");
    }

    const toToRegistration = () =>{
        navigate("/Registration");
    }

    return(       
        <>
        <h1>Trakify</h1>
        <br/>
        <br/>
        <p>Trackify aims to revolutionize family budgeting and expense management by providing a mobile-first solution that enables users to capture expenses in real-time, 
        monitor their spending against budgets, and make informed financial decisions. 
        By integrating with a central web platform, 
        Trackify bridges the gap between convenience and comprehensive financial oversight.
        </p>
        <br /><br /><br />
        <button onClick={() => goToLogin()}>Login</button>
        <button onClick={() => toToRegistration()}>Registration</button>
        </>
    );
}