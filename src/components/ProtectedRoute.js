import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

// General protected route
const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();

  console.log("Check user in ProtectedRoute: ", user);
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

// Admin protected route
export const AdminRoute = ({ children }) => {
  const { user, role } = useUserAuth();

  console.log("Check user in AdminRoute: ", user);
  console.log("Check user role in AdminRoute: ", role);
  if (!user) {
    return <Navigate to="/" />;
  } else {
    if(role === "admin")
      return children;
    else{
      return <> You do not have access to this page</>
    }
  }
};

// Seller protected route
export const SellerRoute = ({ children }) => {
  const { user, role } = useUserAuth();

  console.log("Check user in SellerRoute: ", user);
  console.log("Check user role in SellerRoute: ", role);
  if (!user) {
    return <Navigate to="/" />;
  } else {
    if(role === "admin" || role ==="seller")
      return children;
    else{
      return <> You do not have access to this page</>
    }
  }
};

// Customer protected route
export const CustomerRoute = ({ children }) => {
  const { user, role } = useUserAuth();

  console.log("Check user in CustomerRoute: ", user);
  console.log("Check user role in CustomerRoute: ", role);
  if (!user) {
    return <Navigate to="/" />;
  } else {
    if(role === "admin" || role ==="seller" || role ==="customer")
      return children;
    else{
      return <> You do not have access to this page</>
    }
  }
};

export default ProtectedRoute;