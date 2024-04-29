import BackgroundImg2 from "../assets/blue-background2.jpg";
import ErrorIcon from "../assets/error_icon.svg";
import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImg2})`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100%",
        backgroundPosition: "center center",
        overflowX: "hidden",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={"mainBox errorBox"}>
        <img src={ErrorIcon} />
        <h1>Oh No!</h1>
        <h2>This page is only accessible for desktop users!</h2>
        <h2>Please log on to a desktop to visit {location.pathname}</h2>
      </div>
    </div>
  );
};

export default ErrorPage;
