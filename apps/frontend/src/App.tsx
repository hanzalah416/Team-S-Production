import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import NavBar from "./components/nav_bar/NavBar.tsx";
import OrderFlowers from "./components/flower_requests/OrderFlowers.tsx";
import OrderPayment from "./components/service_requests/payment/OrderPayment.tsx";
import { FormDataProvider } from "./components/service_requests/FormDataContext.tsx";
import FloorMap from "./components/floor_map/FloorMap.tsx";
import HeroPage from "./components/login/Login.tsx";
import NodeDataPage from "./components/nodes/NodeDataPage.tsx";
import { ServiceRequestGetter } from "./components/service_requests/all_requests/AllServiceRequestsGetter.tsx";
import OutlinedAlerts from "./components/service_requests/ServiceNotice.tsx";
import Stack from "@mui/material/Stack";
import OrderConfirmation from "./components/service_requests/OrderConfirmation.tsx";
import SanitationForm from "./components/service_requests/sanitation_services/sanitationForm.tsx";
import FloorMapDebug from "./components/floor_map/FloorMapDebug.tsx";
import RoomScheduling from "./components/service_requests/Room_Scheduling/RoomScheduling.tsx";
import MedicineDeliveryForm from "./components/service_requests/medicine_delivery/MedicineDeliveryForm.tsx";
import SecurityRequest from "./components/service_requests/security_requests/SecurityRequest.tsx";
import { AppState, Auth0Provider } from "@auth0/auth0-react";
import LanguageRequest from "./components/service_requests/language_requests/LanguageRequest.tsx";
import CreditPage from "./components/credit_page/CreditPage.tsx";

function App() {
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
              <FloorMap />
              <Layout />
            </>
          ),
        },
        {
          path: "/order-flowers",
          element: (
            <>
              <OrderFlowers />
              <Layout />
            </>
          ),
        },

        {
          path: "/security-request",
          element: (
            <>
              <SecurityRequest />
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
              <NodeDataPage />
              <Layout />
            </>
          ),
        },
        {
          path: "/all-service-requests",
          element: (
            <>
              <Stack spacing={5}>
                <OutlinedAlerts />
                <ServiceRequestGetter />
              </Stack>
              <Layout />
            </>
          ),
        },
        {
          path: "/sanitation-request",
          element: (
            <>
              <SanitationForm />
              <Layout />
            </>
          ),
        },
        {
          path: "/medicine-delivery-request",
          element: (
            <>
              <MedicineDeliveryForm />
              <Layout />
            </>
          ),
        },
        {
          path: "/room-scheduling",
          element: (
            <>
              <RoomScheduling />
              <Layout />
            </>
          ),
        },
        {
          path: "/map-debug",
          element: (
            <>
              <FloorMapDebug />
              <Layout />
            </>
          ),
        },
        {
          path: "/language-request",
          element: (
            <>
              <LanguageRequest />
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
