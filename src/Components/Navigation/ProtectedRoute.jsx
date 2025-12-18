import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../../hooks/sessionContext";

const ProtectedRoute = ({ children }) => {

  //const isAuthenticated = !!localStorage.getItem("token");

  const { isAuthenticated } = useSession(); //  Koristimo hook iz context

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
