import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BookCopy, BookMarked, LogOut, Users } from "lucide-react";
import { useAtom } from "jotai";
import { UserAtom } from "../../storage/global";
import { apiResourceUrl } from "../../services/api";

export default function DashboardLayout() {
  const [user, setUser] = useAtom(UserAtom);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  if (!user) return;

  const logOutHandler = () => {
    setUser(undefined);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div className="flex flex-col justify-between border-r border-primary w-20 h-full items-center py-4">
        <div className="flex flex-col gap-4">
          {user!.role === "admin" && (
            <DashboardIcon
              onClick={() => navigate("/students")}
              icon={Users}
              isActive={location.pathname === "/students"}
            />
          )}
          <DashboardIcon
            onClick={() => navigate("/")}
            icon={BookCopy}
            isActive={location.pathname === "/"}
          />
          <DashboardIcon
            onClick={() => navigate("/borrows")}
            icon={BookMarked}
            isActive={location.pathname === "/borrows"}
          />
        </div>

        <DashboardIcon
          onClick={logOutHandler}
          icon={LogOut}
          isActive={false}
          color="text-danger"
        />
      </div>

      <div className="flex flex-col w-full">
        <div className="flex py-4 px-4 justify-between">
          {location.pathname === "/" && <span>Books</span>}
          {location.pathname === "/borrows" && <span>Borrows</span>}
          {location.pathname === "/students" && <span>Students</span>}

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span>{user!.fullname}</span>
              <span>{user!.username}</span>
            </div>
            <img
              src={apiResourceUrl(user.profileImage)}
              className="w-14 h-14 rounded-full border object-cover"
            />
          </div>
        </div>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export type DashboardIconProps = {
  isActive: boolean;
  icon: React.ElementType;
  onClick?: () => void;
  color?: string;
};

export function DashboardIcon(props: DashboardIconProps) {
  BookMarked;
  return (
    <div
      onClick={props.onClick}
      className={`flex w-12 ${
        props.isActive ? "border border-primary rounded" : ""
      } p-2 items-center justify-center`}
    >
      <props.icon
        className={`${
          props.isActive
            ? "text-primary"
            : props.color
            ? props.color
            : "text-gray"
        }`}
      />
    </div>
  );
}
