import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleUpload } from "../../../utils/Handlers";
import { apiPostFormData } from "../../../services/api";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [identification, setIdentification] = useState("");
  const [grade, setGrade] = useState("");
  const [password, setPassword] = useState("");
  // TODO: check profile if image is of type null
  const [profileImage, setProfileImage] = useState<File | null>();
  //const [role, setRole] = useState<string>("guess");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("identification", identification);
    formData.append("password", password);
    formData.append("grade", grade);
    formData.append("profileImage", profileImage!);

    //document.cookie = `username=${username} password=${password}`;

    const res = await apiPostFormData("/api/register", formData);
    const resJson = await res.json();
    if (resJson.id) {
      navigate("/home", { state: resJson });
    }
  };

  return (
    <div className="flex w-screen h-screen">
      <div className="flex flex-col m-auto gap-3">
        <div>
          {profileImage && (
            <img
              className="w-16 h-16 m-auto rounded-full object-cover"
              src={URL.createObjectURL(profileImage)}
            />
          )}
          {!profileImage && (
            <div
              className="flex justify-center items-center bg-slate-900 text-slate-50 text-center w-16 h-16 rounded-full m-auto hover:w-20 hover:h-20"
              onClick={async () => {
                // TODO: Remove casting
                setProfileImage((await handleUpload()) as File);
              }}
            >
              <span className="font-bold">Image</span>
            </div>
          )}
        </div>

        <input
          className="focus:outline-none border p-1 rounded focus:ring-1"
          placeholder="Full name"
          onChange={(e) => {
            setFullname(e.target.value);
          }}
        />
        <input
          className="focus:outline-none border p-1 rounded focus:ring-1"
          placeholder="Identification"
          onChange={(e) => {
            setIdentification(e.target.value);
          }}
        />
        <input
          className="focus:outline-none border p-1 rounded focus:ring-1"
          placeholder="Grade"
          type="number"
          max={12}
          min={0}
          onChange={(e) => {
            setGrade(e.target.value);
          }}
        />
        <input
          className="focus:outline-none border p-1 rounded focus:ring-1"
          placeholder="Password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {/* <select
          className="p-2 rounded bg-sky-600 text-slate-50"
          onChange={e => setRole(e.target.value)}
          value={role}
        >
          <option value="admin">Admin</option>
          <option value="guess">Guess</option>
        </select> */}

        <button
          className="border rounded p-2 bg-slate-900 text-slate-50 font-bold hover:bg-slate-700"
          onClick={handleRegister}
        >
          Register
        </button>
        <button
          className="border p-2"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
