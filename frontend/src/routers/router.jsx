import {
  createBrowserRouter
} from "react-router";
import App from "../App";
import { Children } from "react";
import Home from "../pages/home/Home";
import EventList from "../pages/event/EventList";
import Eventdetail from "../pages/event/Eventdetail";
import Recipients from "../pages/recipients/Recipients";
import RecipientDetail from "../pages/recipients/RecipientDetail";
import Registration from "../pages/Registration";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";


import AdminAddEvent from "../pages/admin/AdminAddEvent";
import AdminLogin from "../pages/admin/AdminLogin";
import ReviewOrganizations from "../pages/admin/ReviewOrganizations";
import DonorRegister from "../pages/DonorRegister";


const router = createBrowserRouter([
  {     
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />
        },
         {
            path: "/events",
            element: <EventList />
        },
         {
            path: "/events/:eventId",
            element: <Eventdetail />
        },
        {
            path: "/recipients",
            element: <Recipients />
        },
        {
            path: "/recipients/:recipientId",
            element: <RecipientDetail />
        },
        
        {
            path: "/register",
            element: <Registration />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path : "/donor-register",
            element: <DonorRegister/>
        },
        
        {
            path: "/dashboard",
            element: <div>Dashboard coming soon...</div>
        },
        {
            path: "/admin-dashboard",
            element: <AdminDashboard />
        },
        {
            path: "/admin/dashboard",
            element: <AdminDashboard />
        },
        {
            path: "/admin/add-event",
            element: <AdminAddEvent />
        },
        {
    
},
{
    path: "/admin/login",
    element: <AdminLogin />
},
{
    path: "/admin/review-organizations",
    element: <ReviewOrganizations />
},
    ]
  },



]);
export default router;