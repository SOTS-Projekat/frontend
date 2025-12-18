import "./App.css";
import LoginForm from "./Components/LoginForm/LoginForm";
import { RouterProvider, createHashRouter, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import RegisterForm from "./Components/RegisterForm/RegisterForm";
import ProtectedRoute from "./Components/Navigation/ProtectedRoute";
import CreateTestPage from "./Components/CreateTestPage/CreateTestPage";
import TestSolverPage from "./Components/TestSolverPage/TestSolverPage";
import StudentTestPage from "./Components/TestViewPage/StudentTestPage";
import KnowledgeDomainPage from "./Components/KnowledgeDomain/KnowledgeDomainPage";
import CreateKnowledgeDomain from "./Components/KnowledgeDomain/CreateKnowledgeDomain";
import "react-toastify/dist/ReactToastify.css"; // Uvozi stilove za Toastify
import EditKnowledgeDomain from "./Components/KnowledgeDomain/EditKnowledgeDomain";
import AllTestsPage from "./Components/TestViewPage/AllTestsPage";
import { useSession } from "./hooks/sessionContext";
import React from "react";

function App() {

  function RootEntry() {
    const { isAuthenticated } = useSession();
    return isAuthenticated ? <Navigate to="/test" replace /> : <LoginForm />;
  }

  const router = createHashRouter([ //  useMemo kako bi se nova instanca rutera pravila samo kada se promeni isAuthenticated, odnosno ako se promeni token
    {
      path: "/", element: <RootEntry />,  //  Dinamicki iskoristimo ovo da ne bismo u ruteru gledali isAuthenticated
    },
    {
      path: "/register",
      element: <RegisterForm />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [

        {
          path: "test",
          element: (
            <ProtectedRoute>
              <AllTestsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "test/create",
          element: (
            <ProtectedRoute>
              <CreateTestPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "test/:id",
          element: (
            <ProtectedRoute>
              <TestSolverPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "test/result/:id",
          element: (
            <ProtectedRoute>
              <StudentTestPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "knowledge-domain",
          element: (
            <ProtectedRoute>
              <KnowledgeDomainPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "knowledge-domain/create",
          element: (
            <ProtectedRoute>
              <CreateKnowledgeDomain />
            </ProtectedRoute>
          ),
        },
        {
          path: "knowledge-domain/:id",
          element: (
            <ProtectedRoute>
              <EditKnowledgeDomain />
            </ProtectedRoute>
          ),
        },

      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
