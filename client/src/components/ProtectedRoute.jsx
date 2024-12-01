import { useAuthData } from "@/context/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";



const ProtectedRoute = ({ element }) => {
  const { isSignedIn } = useAuthData();

  return isSignedIn && element ;
};

export default ProtectedRoute;
