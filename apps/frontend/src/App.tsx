
import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NavBar from '../src/components/NavBar.tsx';
import OrderFlowers from "../src/components/OrderFlowers";
import Login from "../src/components/Login";
import NavBarLogin from "../src/components/NavBarLogin";
import CreateAccount from "../src/components/CreateAccount";
import OrderPayment from '../src/components/OrderPayment';
import DisplayFormData from '../src/components/DisplayFormData.tsx';
import {FormDataProvider} from './components/FormDataContext.tsx';
import FloorMap from "../src/components/FloorMap.tsx";



function App() {
    const router = createBrowserRouter([
        {
            children: [

                { path: '/', element:<><Login/><LayoutLogin/></> },
                { path: '/create-account', element:<><CreateAccount/><LayoutLogin/></> },
                { path: '/welcome', element:<><Welcome/><Layout/></> },
                { path: '/order-flowers', element: <><OrderFlowers /><Layout/></> },
                { path: 'payment-info', element: <><OrderPayment /><Layout/></> },
                { path: '/order-flowers-result', element: <><DisplayFormData /><Layout/></> },
                { path: '/forgot-password', element: <><OrderFlowers /><LayoutLogin/></> },
                { path: 'floor-map', element: <><FloorMap /><Layout/></>}


                // ... other routes
            ],
        },
    ]);


    //added this back
    return (<FormDataProvider> {/* Wrap RouterProvider with FormDataProvider for FlowerOrders data */}
            <RouterProvider router={router} />
        </FormDataProvider>
    );
}
function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to your starter code.</h1>
        </div>
    );
}


function Layout() {
    return (
        <>
            <NavBar />
            <Outlet /> {/* Child routes will render here */}
        </>
    );
}

function LayoutLogin() {
    return (
        <>
            <NavBarLogin />
            <Outlet /> {/* Child routes will render here */}
        </>
    );
}





export default App;
