import Logo from '../images/trackify.png'
function Header(){
    return(
        <header className="header">
            <div>
                <img src= {Logo} alt="" />
            </div>
        </header>
    );
}

export default Header