import { useAtom } from "jotai";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { UserAtom } from "../storage/global";

export const BIBLIOTECARIA_PATHS = ["/", "/borrows", "/generates"];

export function ProtectedRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const [isUserStored, setUser] = useAtom(UserAtom);
  const location = useLocation();

  useEffect(() => {
    if (!isUserStored && currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, isUserStored, setUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!isUserStored) {
    if (location.pathname !== "/login" && location.pathname !== "/") return <Navigate to={location.pathname} />;
    return <Navigate to="/" />;
  }

  if (currentUser.role === "bibliotecaria" && !BIBLIOTECARIA_PATHS.includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  return children;
}
