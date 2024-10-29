import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../../services/api";
import Logo from "../../../assets/logo.png";
import { useAtom } from "jotai";
import { UserAtom } from "../../../storage/global";
import { useLanguage } from "../../../i18n/LanguageContext";

export default function Login() {
  const { language } = useLanguage();
  const [_user, setUser] = useAtom(UserAtom);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const currentUser = JSON.parse(storedUser);
    setUser(currentUser);
    navigate("/");
  }, [setUser]);

  const onLogin = async () => {
    const res = await apiPost("/api/login", {
      username: username,
      password: password,
    });
    const resJson = await res.json();

    if (resJson.id) {
      localStorage.setItem("user", JSON.stringify(resJson));
      setUser(resJson);
      navigate("/");
    } else {
      alert(language.LOGIN_FAILED);
    }
  };

  return (
    <div className="flex w-screen h-screen relative">
      <img
        src={Logo}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5 pointer-events-none"
        alt="background-logo"
      />

      <div className="flex flex-col m-auto gap-10 z-10">
        <div className="flex flex-col justify-center items-center">
          <img
            src={Logo}
            className="w-14 h-14 rounded-full border"
            alt="logo"
          ></img>
          <h1 className="font-thin">{language.SCHOOL_NAME}</h1>
          <h2 className="font-bold">{language.LIBRARY_NAME}</h2>
        </div>

        <div className="flex flex-col gap-2">
          <input
            className="focus:outline-none border p-1 rounded focus:ring-1"
            placeholder={language.USERNAME}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            className="focus:outline-none border border-black p-1 rounded focus:ring-1"
            placeholder={language.PASSWORD}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="border p-2 bg-primary rounded-lg text-white font-bold hover:bg-white hover:border-primary hover:text-primary delay-100 ease-in-out"
            onClick={onLogin}
          >
            {language.LOGIN}
          </button>
        </div>
      </div>
    </div>
  );
}
