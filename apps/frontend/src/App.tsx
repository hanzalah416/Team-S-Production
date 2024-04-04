import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import NavBar from "../src/components/NavBar.tsx";
import OrderFlowers from "../src/components/OrderFlowers";
import Login from "../src/components/Login";
import CreateAccount from "../src/components/CreateAccount";
import OrderPayment from "../src/components/OrderPayment";
import { FormDataProvider } from "./components/FormDataContext.tsx";
import FloorMap from "./components/FloorMap/FloorMap.tsx";
import NodeDataPage from "./components/NodeDataPage.tsx";
import { ServiceRequestGetter } from "./components/AllServiceRequestsGetter.tsx";
import OutlinedAlerts from "./components/ServiceNotice.tsx";
import Stack from '@mui/material/Stack';
import OrderConfirmation from "./components/OrderConfirmation.tsx";


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
              path:"/node-data",
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
