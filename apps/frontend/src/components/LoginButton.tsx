import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from "@mui/material/Button";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/",
      },
    });
  };
  //comment
  return (
    <Button
      className="button__login"
      onClick={handleLogin}
      style={{
        textDecoration: "none",
        textTransform: "none",
        paddingLeft: "10px",
        paddingRight: "10px",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 0,
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#003b9c",
      }}
    >
      Log In
    </Button>
  );
};
