import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login/Login";
import { Books } from "./pages/dashboard/books";
import { Borrows } from "./pages/dashboard/borrows";
import GeneratesPage from "./pages/dashboard/generates";
import { Students } from "./pages/dashboard/students";
import { Home } from "./pages/dashboard/home";
import { ProtectedRoute } from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound"; // Import NotFound component
import { DashboardLayout } from "./pages/dashboard";

export default function Root() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "books",
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
        {
          path: "generates",
          element: <GeneratesPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}
