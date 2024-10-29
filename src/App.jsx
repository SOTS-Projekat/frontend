import "./App.css";
import LoginForm from "./Components/LoginForm/LoginForm";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Layout from "./layout/Layout";

function App() {
  const router = createHashRouter([
    {
      path: "/",
      element: <LoginForm />,
    },
    {
      path: "/home",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <h1>Home</h1>,
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
