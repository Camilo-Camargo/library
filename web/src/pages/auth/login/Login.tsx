import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../../services/api";
import Logo from "../../../assets/logo.png";
import { useAtom } from "jotai";
import { UserAtom } from "../../../storage/global";

export default function Login() {
  const [_user, setUser] = useAtom(UserAtom);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex w-screen h-screen">
      <div className="flex flex-col m-auto gap-10">
        <div className="flex flex-col justify-center items-center">
          <img src={Logo} className="w-14 h-14"></img>
          <h1 className="font-thin">Colegio Soraca?</h1>
          <h2 className="font-bold">Library</h2>
        </div>

        <div className="flex flex-col gap-2">
          <input
            className="focus:outline-none border p-1 rounded focus:ring-1"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            className="focus:outline-none border border-black p-1 rounded focus:ring-1"
            placeholder="Password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="border p-2 bg-primary rounded-lg text-white font-bold hover:bg-white hover:border-primary hover:text-primary delay-100 ease-in-out"
            onClick={async () => {
              const res = await apiPost("/api/login", {
                username: username,
                password: password,
              });
              const resJson = await res.json();

              if (resJson.id) {
                setUser(resJson);
                navigate("/");
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
