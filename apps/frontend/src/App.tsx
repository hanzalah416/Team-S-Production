import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import NavBar from "./components/nav_bar/NavBar.tsx";
import OrderFlowers from "./components/flower_requests/OrderFlowers.tsx";
import Login from "./components/login/Login.tsx";
import CreateAccount from "./components/login/create_account/CreateAccount.tsx";
import OrderPayment from "./components/service_requests/payment/OrderPayment.tsx";
import { FormDataProvider } from "./components/service_requests/FormDataContext.tsx";
import FloorMap from "./components/floor_map/FloorMap.tsx";
import NodeDataPage from "./components/nodes/NodeDataPage.tsx";
import { ServiceRequestGetter } from "./components/service_requests/all_requests/AllServiceRequestsGetter.tsx";
import OutlinedAlerts from "./components/service_requests/ServiceNotice.tsx";
import Stack from "@mui/material/Stack";
import OrderConfirmation from "./components/service_requests/OrderConfirmation.tsx";
import SanitationForm from "./components/service_requests/sanitation_services/sanitationForm.tsx";
import MiniMap from "./components/floor_map/MiniMap.tsx";

function App() {
  const router = createBrowserRouter([
    {
      children: [
        {
          path: "/",
          element: (
            <>
              <Login />
            </>
          ),
        },
        {
          path: "/create-account",
          element: (
            <>
              <CreateAccount />
            </>
          ),
        },
        {
          path: "/welcome",
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
          path: "/forgot-password",
          element: (
            <>
              <div />
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
          path: "/MiniMap",
          element: (
            <>
              <MiniMap />
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

// function Welcome() {
//   return (
//     <div className="welcome">
//       <h1>Welcome to your starter code.</h1>
//     </div>
//   );
// }

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet /> {/* Child routes will render here */}
    </>
  );
}

export default App;
