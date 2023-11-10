/**
=========================================================
* Food Flow
=========================================================
* Template used - Material Dashboard 2 React - v2.1.0
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
=========================================================
*/

/** 
  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Listings from "layouts/listings/available";
import Reserved from "layouts/listings/reserved";
import DetailedListing from "layouts/detailed-listing";
import UserListings from "layouts/user-listings";

import Reservation  from "layouts/reservation";
import UserProfile from "layouts/user-profile";

import Login from "auth/login";
import Register from "auth/register";

import UploadFood from "layouts/donor/upload";
import DonateFood from "layouts/donor/create";
import UpdateListing from "layouts/donor/update-listing";

// @mui icons
import Icon from "@mui/material/Icon";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';

const routes = [
  {
    type: "collapse",
    name: "Available",
    key: "listings",
    icon: <FoodBankIcon fontSize="small" />,
    route: "/listings",
    component: <Listings />,
  },
  {
    type: "collapse",
    name: "My listings",
    key: "mylistings",
    icon: <LocalPizzaIcon fontSize="small" />,
    route: "/mylistings",
    component: <UserListings />,
  },
  {
    type: "collapse",
    name: "Reserved",
    key: "reserved",
    icon: <FastfoodIcon fontSize="small" />,
    route: "/reserved",
    component: <Reserved />,
  },
  {
    type: "item",
    name: "Detailed Listing",
    key: "detailed-listing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/listings/:listingID",
    component: <DetailedListing />,
  },
  {
    type: "item",
    name: "Update Listing",
    key: "update-listing",
    icon: <Icon fontSize="small">edit</Icon>,
    route: "/listings/:listingID/update",
    component: <UpdateListing />,
  },
  {
    type: "collapse",
    name: "Donate",
    key: "upload",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/upload",
    component: <UploadFood />,
  },
  {
    type: "route",
    name: "Donate",
    key: "donate",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/upload/donate",
    component: <DonateFood />,
  },
  {
    type: "collapse",
    name: "Reservations",
    key: "reservations",
    icon: <FoodBankIcon fontSize="small" />,
    route: "/reservations",
    component: <Reservation />,
  },
  {
    type: "examples",
    name: "User Profile",
    key: "user-profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/user-profile",
    component: <UserProfile />,
  },
  {
    type: "auth",
    name: "Login",
    key: "login",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <Login />,
  },
  {
    type: "auth",
    name: "Register",
    key: "register",
    icon: <Icon fontSize="small">register</Icon>,
    route: "/auth/register",
    component: <Register />,
  },
];

export default routes;