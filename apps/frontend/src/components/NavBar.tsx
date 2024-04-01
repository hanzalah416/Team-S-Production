import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
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
        <Link to={"/floor-map"} className={"item"} id={"map"}>
          <div className={"temp"}>
            <img
              src="/src/components/assets/NavBarIcons/map_icon_nav.png"
              className={"map_icon"}
              alt={"map_icon"}
            />
            <p>Our Map</p>
          </div>
        </Link>
        <div className={"dropdown"}>
          <div className={"item"}>
            <img
              src="/src/components/assets/NavBarIcons/arrow_drop_down_nav.png"
              className={"dropdown_arrow"}
              alt={"Drop Down arrow"}
            />
            <p>Services</p>
          </div>
          <div className={"dropdown-content"}>
            <ul>
              <li>
                <Link to={"/order-flowers"} className={"item"} id={"order"}>
                  Order Flowers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={"dropdown"}>
          <button className={"item profile-button"}>
            <img
              src="/src/components/assets/NavBarIcons/profile_icon_nav.png"
              className={"userIcon"}
              alt={"Profile Button"}
            />
            <p>My Profile</p>
          </button>
          <div className={"dropdown-content"}>
            <ul>
              <li>
                <Link to={"/"} className={"item"} id={"log-out"}>
                  Log Out
                </Link>
              </li>
              <li>
                <Link
                  to={"/change-password"}
                  className={"item"}
                  id={"change-password"}
                >
                  Change Password
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={"blueBar"} />
    </div>
  );
}

export default NavBar;
