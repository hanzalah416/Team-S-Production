import { Link, useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import bwhLogo from "../assets/bwh-logo-ICON-ONLY.svg";
import mapIcon from "../assets/NavBarIcons/map_icon.svg";
import patientListIcon from "../assets/NavBarIcons/patient_list.svg";
import homePinIcon from "../assets/NavBarIcons/home_pin.svg";
import flowerIcon from "../assets/NavBarIcons/flowers_icon.svg";
import medicineIcon from "../assets/NavBarIcons/medication_icon.svg";
import securityIcon from "../assets/NavBarIcons/security_icon.svg";
import sanitationIcon from "../assets/NavBarIcons/sanitation_icon.svg";
import roomSchedulingIcon from "../assets/NavBarIcons/schedule_icon.svg";
import languageIcon from "../assets/NavBarIcons/language_icon.svg";
import dropDownIcon from "../assets/NavBarIcons/drop_down.svg";
import { createTheme, FormControl, ThemeProvider } from "@mui/material";
import { useCallback, useEffect } from "react";

declare module "@mui/material/styles" {
  interface Palette {
    websiteBlue: Palette["primary"];
  }

  interface PaletteOptions {
    websiteBlue?: PaletteOptions["primary"];
  }
}

// Update the Button's color options to include an ochre option
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    websiteBlue: true;
  }
}

const theme = createTheme({
  palette: {
    websiteBlue: {
      main: "#003B9C",
      light: "#004ac4",
      dark: "#002c75",
      contrastText: "#00102b",
    },
  },
});

function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const today = new Date();
  const [timeOfDay, updateTimeOfDay] = React.useState("");

  const location = useLocation();
  const [currServIcon, setServIcon] = React.useState(homePinIcon);

  const mapID = document.getElementById("mapID");
  const requestsID = document.getElementById("requestsID");
  const servicesID = document.getElementById("servicesID");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogInOutButton = () => {
    navigate("/");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setServicesID = useCallback(() => {
    if (servicesID) {
      servicesID.classList.add("currItem");
    }
    if (mapID) {
      mapID.classList.remove("currItem");
    }
    if (requestsID) {
      requestsID.classList.remove("currItem");
    }
  }, [servicesID, mapID, requestsID]);

  const setMapID = useCallback(() => {
    if (servicesID) {
      servicesID.classList.remove("currItem");
    }
    if (mapID) {
      mapID.classList.add("currItem");
    }
    if (requestsID) {
      requestsID.classList.remove("currItem");
    }
  }, [servicesID, mapID, requestsID]);

  const setRequestsID = useCallback(() => {
    if (servicesID) {
      servicesID.classList.remove("currItem");
    }
    if (mapID) {
      mapID.classList.remove("currItem");
    }
    if (requestsID) {
      requestsID.classList.add("currItem");
    }
  }, [servicesID, mapID, requestsID]);

  useEffect(() => {
    const hours = today.getHours();
    let timeOfDay = "";
    if (hours < 12) {
      timeOfDay = "Good Morning";
    } else if (hours < 17) {
      timeOfDay = "Good Afternoon";
    } else {
      timeOfDay = "Good Evening";
    }
    updateTimeOfDay(timeOfDay);
  }, [today]);

  useEffect(() => {
    console.log(location.pathname);
    switch (location.pathname) {
      case "/order-flowers":
        setServIcon(flowerIcon);
        setServicesID();
        break;
      case "/medicine-delivery-request":
        setServIcon(medicineIcon);
        setServicesID();
        break;
      case "/security-request":
        setServIcon(securityIcon);
        setServicesID();
        break;
      case "/sanitation-request":
        setServIcon(sanitationIcon);
        setServicesID();
        break;
      case "/room-scheduling":
        setServIcon(roomSchedulingIcon);
        setServicesID();
        break;
        case "/language-request":
            setServIcon(languageIcon);
            setServicesID();
            break;
      case "/all-service-requests":
        setRequestsID();
        break;
      case "/welcome":
        setMapID();
        break;
      default:
        setServIcon(homePinIcon);
    }
  }, [location, setServicesID, setMapID, setRequestsID]);

  return (
    <div className="navbar">
      {/* Navbar content */}
      <div className={"leftSide"}>
        <img
          src={bwhLogo}
          className={"bwh-logo"}
          alt={
            "Brigham and Women's Hospital logo, reading " +
            "'Founding member, Mass General Brigham'"
          }
        />
        <p className={"time"}>{timeOfDay}</p>
      </div>
      <div className={"navButtons"}>
        <Link to={"/welcome"} id={"map"}>
          <Button className={"alignIcons"}>
            <img src={mapIcon} className={"iconHeight"} alt={"map_icon"} />
            <p id={"mapID"} className={"itemNames"}>
              {" "}
              Our Map
            </p>
          </Button>
        </Link>
        <FormControl>
          <Link to={"/all-service-requests"} id={"order"}>
            <Button className={"alignIcons"}>
              <img
                src={patientListIcon}
                className={"iconHeight"}
                width={"38px"}
              />
              <p id={"requestsID"} className={"itemNames"}>
                All Requests
              </p>
            </Button>
          </Link>
        </FormControl>
        <div>
          <Button
            id="services-button"
            aria-controls={open ? "services-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <div className={"alignIcons"}>
              <img src={currServIcon} className={"iconHeight"} width={"29px"} />
              <p id={"servicesID"} className={"itemNames"}>
                Services
              </p>
            </div>
            <img src={dropDownIcon} />
          </Button>
          <Menu
            id="services-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "services-button",
            }}
          >
            <Link to={"/order-flowers"} id={"order"}>
              <MenuItem onClick={handleClose}>
                <p className={"item"}>Order Flowers</p>
              </MenuItem>
            </Link>
            <Link to={"/medicine-delivery-request"} id={"order"}>
              <MenuItem onClick={handleClose}>
                <p className={"item"}>Medical Delivery</p>
              </MenuItem>
            </Link>
            <Link to={"/sanitation-request"} id={"order"}>
              <MenuItem onClick={handleClose}>
                <p className={"item"}>Sanitation Services</p>
              </MenuItem>
            </Link>
            <Link to={"/security-request"} id={"order"}>
              <MenuItem onClick={handleClose}>
                <p className={"item"}>Security Requests</p>
              </MenuItem>
            </Link>
            <Link to={"/room-scheduling"} id={"order"}>
              <MenuItem onClick={handleClose}>
                <p className={"item"}>Room Scheduling</p>
              </MenuItem>
            </Link>
              <Link to={"/language-request"} id={"order"}>
                  <MenuItem onClick={handleClose}>
                      <p className={"item"}>Language Request</p>
                  </MenuItem>
              </Link>
            <Link to={"/map-debug"} id={"order"}>
              <MenuItem onClick={handleClose}>
                <p className={"item"}>Map Editing Page</p>
              </MenuItem>
            </Link>

          </Menu>
        </div>
      </div>
      <div className={"rightSide"}>
        <p className={"username"}>USERNAME</p>
        <FormControl>
          <ThemeProvider theme={theme}>
            <Button
              id="login-out-button"
              variant="contained"
              color={"websiteBlue"}
              onClick={handleLogInOutButton}
            >
              <p className={"logOutInText"}>Log Out</p>
            </Button>
          </ThemeProvider>
        </FormControl>
      </div>
      <div className={"blueBar"} />
    </div>
  );
}

export default NavBar;
