import { Link } from "react-router-dom";
import "./NavBar.css";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import bwhLogo from "../assets/bwh-logo-ICON-ONLY.svg";
import mapIcon from "../assets/NavBarIcons/map_icon_nav.png";
import arrowDropDown from "../assets/NavBarIcons/arrow_drop_down_nav.png";
import { createTheme, FormControl, ThemeProvider } from "@mui/material";
import { useEffect } from "react";

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const today = new Date();
  const [timeOfDay, updateTimeOfDay] = React.useState("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogInOutButton = () => {
    return <Link to={"/"} />;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <div></div>
        <Link to={"/welcome"} className={"item"} id={"map"}>
          <Button>
            <img src={mapIcon} className={"map_icon"} alt={"map_icon"} />
            <p className={"navNames"}> Our Map</p>
          </Button>
        </Link>
        <div>
          <Button
            id="services-button"
            aria-controls={open ? "services-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            className={"col_gap_5px"}
          >
            <span>
              <img
                src={arrowDropDown}
                className={"dropdown_arrow"}
                alt={"Drop Down arrow"}
              />
            </span>
            <p className={"navNames"}>Services</p>
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
            <Link to={"/all-service-requests"} id={"order"}>
              <MenuItem onClick={handleClose}>
                <p className={"item"}>All Service Requests</p>
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
                <p className={"item"}>Room Scheduling Services</p>
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
