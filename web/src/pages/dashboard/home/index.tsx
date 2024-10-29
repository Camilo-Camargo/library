import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookCopy, BookMarked, PocketKnife, Users } from "lucide-react";
import { useAtom } from "jotai";
import { UserAtom } from "../../../storage/global";
import { useLanguage } from "../../../i18n/LanguageContext";

export function Home() {
  const [user, _setUser] = useAtom(UserAtom);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const navItems: any = [];

  if (user.role === "admin") {
    navItems.push({
      path: "/students",
      icon: <Users className="w-6 h-6" />,
      title: language.STUDENTS,
      variant: "primary",
    });
    navItems.push({
      path: "/books",
      icon: <BookCopy className="w-6 h-6" />,
      title: language.BOOKS,
      variant: "primary",
    });
  }

  navItems.push({
    path: "/borrows",
    icon: <BookMarked className="w-6 h-6" />,
    title: language.BORROWS,
    variant: "primary",
  });

  navItems.push({
    path: "/generates",
    icon: <PocketKnife className="w-6 h-6" />,
    title: language.GENERATES,
    variant: "primary",
  });

  return (
    <div className="flex items-start justify-start h-full bg-gray-100 p-4 w-full">
      <div className="flex gap-4">
        {navItems.map(({ path, icon, title }) => (
          <div
            key={path}
            className="flex items-center justify-between p-4 border border-primary rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer hover:shadow-xl"
            onClick={() => navigate(path)}
          >
            <div className="flex items-center gap-2 text-gray-700">
              {icon}
              <span className="font-medium">{title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
