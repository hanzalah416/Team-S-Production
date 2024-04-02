import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  //Map button will link you to a 404 page, order flowers will link you to the order flowers page
  //Once Map page is made, we can change the link to the correct path
  // Log out and change password in the user dropdown are also using unmade paths until these pages are made
  // Note that this will have to be changed to 'sign in' only if user is not logged it, will wait until log in page
  // is done
  return (
    <div className="navbar">
      {/* Navbar content */}
      <img
        src="/src/components/assets/bwh-logo.svg"
        className={"bwh-logo"}
        alt={
          "Brigham and Women's Hospital logo, reading " +
          "'Founding member, Mass General Brigham'"
        }
      />
      <div className={"navButtons"}>
        <Link to={"/order-flowers"} className={"button"} id={"order"}>
          <b>SERVICE REQUEST</b>
        </Link>
        <Link to={"/floor-map"} className={"button"} id={"map"}>
          HOSPITAL MAP
        </Link>
        <div className={"dropdown"}>
          <button className={"profile-button"}>
            <img
              src="/src/components/assets/userIcon.png"
              className={"userIcon"}
              alt={"Profile Button"}
            />
          </button>
          <div className={"dropdown-content"}>
            <ul>
              <li>
                <Link to={"/"} className={"button"} id={"log-out"}>
                  Log Out
                </Link>
              </li>
              <li>
                <Link
                  to={"/change-password"}
                  className={"button"}
                  id={"change-password"}
                >
                  Change Password
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
