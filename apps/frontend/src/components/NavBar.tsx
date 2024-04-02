import { Link } from "react-router-dom";
import "./NavBar.css";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl1);

  const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget);
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };

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
          <img
            src="/src/components/assets/NavBarIcons/map_icon_nav.png"
            className={"map_icon"}
            alt={"map_icon"}
          />
          <p>Our Map</p>
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
                src="/src/components/assets/NavBarIcons/arrow_drop_down_nav.png"
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
            <MenuItem onClick={handleClose}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                Order Flowers
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                Audio/Visual Services
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                External Transportation
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                Maintenance
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                Internal Transportation
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                Language Services
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                Medical Delivery
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                Religious Requests
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                Sanitation Services
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link to={"/order-flowers"} className={"item"} id={"order"}>
                Security Services
              </Link>
            </MenuItem>
          </Menu>
        </div>
        <div>
          <Button
            id="my-profile-button"
            aria-controls={open ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick1}
            className={"col_gap_5px"}
          >
            <img
              src="/src/components/assets/NavBarIcons/profile_icon_nav.png"
              className={"userIcon"}
              alt={"Profile Button"}
            />
            <p className={"navNames"}>My Profile</p>
          </Button>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl1}
            open={open1}
            onClose={handleClose1}
            MenuListProps={{
              "aria-labelledby": "my-profile-button",
            }}
          >
            <MenuItem onClick={handleClose}>
              <Link to={"/"} className={"item"} id={"log-out"}>
                Log Out
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} disabled={true}>
              <Link
                to={"/change-password"}
                className={"item"}
                id={"change-password"}
              >
                Change Password
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className={"blueBar"} />

    </div>
  );
}

export default NavBar;
