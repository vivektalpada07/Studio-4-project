import React from "react";
import { useUserAuth } from "../context/UserAuthContext";
import AdminHeader from "./Adminheader"; // Import the header component for admin users
import SellerHeader from "./SellerHeader"; // Import the header component for seller users
import CustomerHeader from "./Customerheader"; // Import the header component for customer users
import Header from "./Header"; // Import the default header component for other users

const HeaderSwitcher = () => {
  // Retrieve the current user's role from the authentication context
  const { role } = useUserAuth();
 
  return (
    <>
      {/* Render the appropriate header based on the user's role */}
      {role === "admin" && <AdminHeader />}       {/* For admin users */}
      {role === "seller" && <SellerHeader />}     {/* For seller users */}
      {role === "customer" && <CustomerHeader />} {/* For customer users */}
      {role !== "admin" && role !== "seller" && role !== "customer" && <Header />} {/* For users with no specific role */}
      {/* Optionally, you can handle other roles or a default header here */}
    </>
  );
};
 
export default HeaderSwitcher;
