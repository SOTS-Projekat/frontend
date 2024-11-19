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
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "home",
          element: <HomePage />,
        },
        {
          path: "test",
          element: <CreateTestPage />,
        },
        {
          path: "test/:id",
          element: <TestSolverPage />,
        },
        {
          path: "test/result/:id",
          element: <StudentTestPage />,
        },
        {
          path: "knowledge-domain",
          element: <KnowledgeDomainPage />,
        },
        {
          path: "knowledge-domain/create",
          element: <CreateKnowledgeDomain />,
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
