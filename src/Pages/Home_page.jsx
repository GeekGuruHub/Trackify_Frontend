import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';


export default function HomePage(){

    const navigate = useNavigate();

    const goToLogin = () =>{
        navigate("/login_test");
    }

    const goToRegistration = () =>{
        navigate("/RegistrationForm");
    }

    const goToForm = () =>{
        navigate("/Form");
    }

    return(       
        <>       
        <Header/>          
        <br/>
        <h2>Trackify aims to revolutionize family budgeting and expense management by providing a mobile-first solution that enables users to capture expenses in real-time, 
        monitor their spending against budgets, and make informed financial decisions. 
        By integrating with a central web platform, 
        Trackify bridges the gap between convenience and comprehensive financial oversight.
        </h2>
        <br /><br /><br />
        <div 
        className="flex items items-center justify-center pb-5">
            <button className='mr-20' onClick={() => goToForm()}>Login</button>
            <button onClick={() => goToRegistration()}>Register</button>
        </div>
             
        </>
    );
}