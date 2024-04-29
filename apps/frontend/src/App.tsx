import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import NavBar from "./components/nav_bar/NavBar.tsx";
import OrderFlowers from "./components/service_requests/flower_requests/OrderFlowers.tsx";
import OrderPayment from "./components/service_requests/payment/OrderPayment.tsx";
import { FormDataProvider } from "./components/service_requests/FormDataContext.tsx";
import FloorMap from "./components/floor_map/FloorMap.tsx";
import HeroPage from "./components/login/Login.tsx";
import NodeDataPage from "./components/nodes/NodeDataPage.tsx";
// import { ServiceRequestGetter } from "./components/service_requests/all_requests/AllServiceRequestsGetter.tsx";
import DisplaySRData from "./components/service_requests/all_requests/DisplaySRData.tsx";
import OrderConfirmation from "./components/service_requests/OrderConfirmation.tsx";
import SanitationForm from "./components/service_requests/sanitation_services/sanitationForm.tsx";
import FloorMapDebug from "./components/floor_map/FloorMapDebug.tsx";
import RoomScheduling from "./components/service_requests/Room_Scheduling/RoomScheduling.tsx";
import MedicineDeliveryForm from "./components/service_requests/medicine_delivery/MedicineDeliveryForm.tsx";
import SecurityRequest from "./components/service_requests/security_requests/SecurityRequest.tsx";
import { AppState, Auth0Provider } from "@auth0/auth0-react";
import LanguageRequest from "./components/service_requests/language_requests/LanguageRequest.tsx";
import CreditPage from "./components/credit_page/CreditPage.tsx";
import TransportRequest from "./components/service_requests/internalTransportation/TransportRequest.tsx";
import EmailForm from "./components/awsEmailConnection/EmailForm.tsx";
import GiftForm from "./components/service_requests/gift_request/giftForm.tsx";
import { AboutPage } from "./components/about_page/AboutPage.tsx";
import MobileFlower from "./components/service_requests/flower_requests/MobileFlower.tsx";
import MobileGift from "./components/service_requests/gift_request/MobileGift.tsx";
import MobileMedicine from "./components/service_requests/medicine_delivery/MobileMedicine.tsx";
import MobileSanitation from "./components/service_requests/sanitation_services/MobileSanitation.tsx";
import MobileSecurity from "./components/service_requests/security_requests/MobileSecurity.tsx";
import MobileScheduling from "./components/service_requests/Room_Scheduling/MobileScheduling.tsx";
import MobileLanguage from "./components/service_requests/language_requests/MobileLanguage.tsx";
import MobileTransportation from "./components/service_requests/internalTransportation/MobileTransportation.tsx";
import ErrorPage from "./components/error_page/ErrorPage.tsx";
import AwsPublishForm from "./components/awsEmailConnection/awsPublish.tsx";
import MobileMap from "./components/floor_map/MobileMap.tsx";
import StatsPage from "./components/stats_page/StatsPage.tsx";

function App() {
  const isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i,
  );
  const router = createBrowserRouter([
    {
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroPage />
              <Layout />
            </>
          ),
        },
        {
          path: "/floor-map",
          element: (
            <>
              {isMobile && <MobileMap />}
              {!isMobile && <FloorMap />}
              <Layout />
            </>
          ),
        },
        {
          path: "/order-flowers",
          element: (
            <>
              {isMobile && <MobileFlower />}
              {!isMobile && <OrderFlowers />}
              <Layout />
            </>
          ),
        },

        {
          path: "/security-request",
          element: (
            <>
              {isMobile && <MobileSecurity />}
              {!isMobile && <SecurityRequest />}
              <Layout />
            </>
          ),
        },
        {
          path: "payment-info",
          element: (
            <>
              <OrderPayment />
              <Layout />
            </>
          ),
        },
        {
          path: "/order-flowers-result",
          element: (
            <>
              <OrderConfirmation />
              <Layout />
            </>
          ),
        },
        {
          path: "/node-data",
          element: (
            <>
              {isMobile && <ErrorPage />}
              {!isMobile && <NodeDataPage />}
              <Layout />
            </>
          ),
        },
        {
          path: "/all-service-requests",
          element: (
            <>
              <DisplaySRData />
              <Layout />
            </>
          ),
        },
        {
          path: "/sanitation-request",
          element: (
            <>
              {isMobile && <MobileSanitation />}
              {!isMobile && <SanitationForm />}
              <Layout />
            </>
          ),
        },
        {
          path: "/medicine-delivery-request",
          element: (
            <>
              {isMobile && <MobileMedicine />}
              {!isMobile && <MedicineDeliveryForm />}
              <Layout />
            </>
          ),
        },
        {
          path: "/sign-up-email",
          element: (
            <>
              <EmailForm />
              <Layout />
            </>
          ),
        },
        {
          path: "/message-publish",
          element: (
            <>
              <AwsPublishForm />
              <Layout />
            </>
          ),
        },
        {
          path: "/room-scheduling",
          element: (
            <>
              {isMobile && <MobileScheduling />}
              {!isMobile && <RoomScheduling />}
              <Layout />
            </>
          ),
        },
        {
          path: "/map-debug",
          element: (
            <>
              {isMobile && <ErrorPage />}
              {!isMobile && <FloorMapDebug />}
              <Layout />
            </>
          ),
        },
        {
          path: "/stats-page",
          element: (
            <>
              {isMobile && <ErrorPage />}
              {!isMobile && <StatsPage />}
              <Layout />
            </>
          ),
        },
        {
          path: "/language-request",
          element: (
            <>
              {isMobile && <MobileLanguage />}
              {!isMobile && <LanguageRequest />}
              <Layout />
            </>
          ),
        },
        {
          path: "/transport-request",
          element: (
            <>
              {isMobile && <MobileTransportation />}
              {!isMobile && <TransportRequest />}
              <Layout />
            </>
          ),
        },
        {
          path: "/credit-page",
          element: (
            <>
              <CreditPage />
              <Layout />
            </>
          ),
        },
        {
          path: "/gift-request",
          element: (
            <>
              {isMobile && <MobileGift />}
              {!isMobile && <GiftForm />}
              <Layout />
            </>
          ),
        },

        {
          path: "/about-page",
          element: (
            <>
              <AboutPage />
              <Layout />
            </>
          ),
        },

        // ... other routes
      ],
    },
  ]);

  //added this back
  return (
    <FormDataProvider>
      {" "}
      {/* Wrap RouterProvider with FormDataProvider for FlowerOrders data */}
      <RouterProvider router={router} />
    </FormDataProvider>
  );
}

function Layout() {
  const navigate = useNavigate();
  return (
    <Auth0Provider
      useRefreshTokens
      cacheLocation="localstorage"
      domain="dev-q6nptoajn7kajoxf.us.auth0.com"
      clientId="3UbU8v3PXSEQJsRMtwCJdvoKeWigw8eA"
      onRedirectCallback={(appState: AppState | undefined): void => {
        navigate(appState?.returnTo || window.location.pathname);
      }}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "/api",
        scope: "openid profile email offline_access",
      }}
    >
      <>
        <NavBar />
        <Outlet /> {/* Child routes will render here */}
      </>
    </Auth0Provider>
  );
}

export default App;
