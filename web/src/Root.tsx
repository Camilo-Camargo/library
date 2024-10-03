import { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login/Login";
import DashboardLayout from "./pages/dashboard";
import { Books } from "./pages/dashboard/books";
import { Borrows } from "./pages/dashboard/borrows";
import { Students } from "./pages/dashboard/students";
export default function Root() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        {
          path: "",
          element: <Books />,
        },
        {
          path: "borrows",
          element: <Borrows />,
        },
        {
          path: "students",
          element: <Students />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}
