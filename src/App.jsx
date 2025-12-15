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
import HomePage from "./Components/HomePage/HomePage";
import AllTestsPage from "./Components/TestViewPage/AllTestsPage";


function App() {

  const isAuthenticated = !!localStorage.getItem("token");  //  Gledamo ovako da li je autentifikovan korisnik, posto nas hook useSession je ziv samo po komponentama, ne u celoj app.
  console.log(isAuthenticated);

  const router = createHashRouter([
    {
      path: "/",
      element: isAuthenticated ? <Navigate to="/home" replace /> : <LoginForm />, //  Dodali smo replace, posto imamo vec navigate u navigation.jsx pa da se ne bi duplo pozivalo
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
