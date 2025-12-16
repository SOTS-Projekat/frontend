import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../../hooks/useSession";

const ProtectedRoute = ({ children }) => {

  //const isAuthenticated = !!localStorage.getItem("token");

  const { isAuthenticated } = useSession(); //  Koristimo hook 

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
