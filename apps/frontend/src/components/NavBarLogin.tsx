
import './NavBarLogin.css';

function NavBar() {

    //Map button will link you to a 404 page, order flowers will link you to the order flowers page
    //Once Map page is made, we can change the link to the correct path
    return(
        <div className="navbarLogin">
            {/* Navbar content */}
            <img src="assets/bwh-logo.svg" className={"bwh-logo-login"} alt={"logo"}/>
        </div>
    );
}

export default NavBar;
