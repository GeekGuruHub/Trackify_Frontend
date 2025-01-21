import Logo from '../images/trackify.png'
function Header(){
    return(

        <div className="w-full h-screen flex items-center justify-center">
            <img src={Logo} alt="Logo" className="w-full h-45" />
        </div>
      

    );
}

export default Header