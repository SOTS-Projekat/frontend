import "./App.css";
import LoginForm from "./Components/LoginForm/LoginForm";
import { RouterProvider, createHashRouter, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import RegisterForm from "./Components/RegisterForm/RegisterForm";
import ProtectedRoute from "./Components/Navigation/ProtectedRoute";
import HomePage from "./Components/HomePage/HomePage";
import CreateTestPage from "./Components/CreateTestPage/CreateTestPage";
import TestSolverPage from "./Components/TestSolverPage/TestSolverPage";
import StudentTestPage from "./Components/TestViewPage/StudentTestPage";
import KnowledgeDomainPage from "./Components/KnowledgeDomain/KnowledgeDomainPage";
import CreateKnowledgeDomain from "./Components/KnowledgeDomain/CreateKnowledgeDomain";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  console.log(isAuthenticated);

  const router = createHashRouter([
    {
      path: "/",
      element: isAuthenticated ? <Navigate to="/home" /> : <LoginForm />,
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
          path: "home",
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "test",
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
