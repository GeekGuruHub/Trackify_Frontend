import Logo from '../images/trackify.png'
function Header(){
    return(
        <header className="min-h-0 max-h-full">
            <div>
                <img src= {Logo} alt="Logo"/>
            </div>
        </header>
    );
}

export default Header