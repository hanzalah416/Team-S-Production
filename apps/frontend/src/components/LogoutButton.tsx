import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from "@mui/material/Button";

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };
  //comment
  return (
    <Button className="button__logout" onClick={handleLogout}
        style={{textDecoration: "none",
        textTransform: "none",
        paddingLeft: "10px",
        paddingRight: "10px",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 0,
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#003b9c"}}>
      Log Out
    </Button>
  );
};
