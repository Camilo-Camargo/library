import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookCopy,
  BookMarked,
  LayoutDashboard,
  LogOut,
  PocketKnife,
  Users,
} from "lucide-react";
import { useAtom } from "jotai";
import { UserAtom } from "../../storage/global";
import { apiResourceUrl } from "../../services/api";
import { useLanguage } from "../../i18n/LanguageContext";

export function DashboardLayout() {
  const [user, setUser] = useAtom(UserAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  if (!user) return null;

  const logOutHandler = () => {
    localStorage.removeItem("user");
    setUser(undefined);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div className="flex flex-col justify-between border-r border-primary w-20 h-full items-center py-4">
        <div className="flex flex-col gap-4">
          <DashboardIcon
            onClick={() => navigate("/")}
            icon={LayoutDashboard}
            isActive={location.pathname === "/"}
          />
          {user!.role === "admin" && (
            <DashboardIcon
              onClick={() => navigate("/students")}
              icon={Users}
              isActive={location.pathname === "/students"}
            />
          )}
          {user!.role === "admin" && (
            <DashboardIcon
              onClick={() => navigate("/books")}
              icon={BookCopy}
              isActive={location.pathname === "/books"}
            />
          )}
          <DashboardIcon
            onClick={() => navigate("/borrows")}
            icon={BookMarked}
            isActive={location.pathname === "/borrows"}
          />
          <DashboardIcon
            onClick={() => navigate("/generates")}
            icon={PocketKnife}
            isActive={location.pathname === "/generates"}
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
          {location.pathname === "/" && <span>{language.DASHBOARD}</span>}
          {location.pathname === "/books" && <span>{language.BOOKS}</span>}
          {location.pathname === "/borrows" && <span>{language.BORROWS}</span>}
          {location.pathname === "/students" && (
            <span>{language.STUDENTS}</span>
          )}
          {location.pathname === "/generates" && (
            <span>{language.GENERATES}</span>
          )}

          <div className="flex items-center gap-4">
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
