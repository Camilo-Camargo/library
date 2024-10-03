import { useAtom } from "jotai";
import { UserAtom } from "../../../storage/global";
import { useEffect, useState } from "react";
import { apiGet, apiPostFormData } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/book";
import { handleUpload } from "../../../utils/Handlers";
import { Counter } from "../../../components/Counter";
import { StudentItem } from "../components/Student";

export function Students() {
  const navigate = useNavigate();

  const [user, _setUser] = useAtom(UserAtom);
  const [students, setStudents] = useState<User[]>([]);

  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState(1);
  const [identification, setIdentification] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>();

  const getStudents = async () => {
    const res = await apiGet("/api/student");
    const resData = await res.json();
    setStudents(resData);
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("password", password);
    formData.append("identification", identification);
    formData.append("grade", grade.toString());
    formData.append("profileImage", profileImage!);

    const res = await apiPostFormData("/api/register", formData);
    const resJson = await res.json();
    if (resJson.id) {
      await getStudents();
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") navigate("/");
    getStudents();
  }, []);

  if (!user) return;

  return (
    <div className="flex flex-col h-full w-full gap-4">
      <div className="flex flex-wrap gap-10 items-center pl-4 pt-4 overflow-auto">

        <div className="flex flex-col gap-2 w-[180px]">
          <div>
            {profileImage && (
              <img
                className="w-[120px] h-[120px] m-auto rounded-lg object-cover border"
                src={URL.createObjectURL(profileImage)}
              />
            )}
            {!profileImage && (
              <div
                className="flex justify-center items-center bg-slate-900 text-slate-50 text-center w-[120px] h-[120px]  rounded-lg m-auto border-dashed border"
                onClick={async () => {
                  // TODO: Remove casting
                  setProfileImage((await handleUpload()) as File);
                }}
              >
                <span className="font-bold">Upload Cover</span>
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
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            className="focus:outline-none border p-1 rounded focus:ring-1"
            placeholder="Identification"
            onChange={(e) => {
              setIdentification(e.target.value);
            }}
          />
          <div className="flex flex-col">
            <span>Grade</span>
            <Counter min={1} max={12} onChange={(c) => setGrade(c)} />
          </div>
          <button
            className="border rounded p-2 bg-slate-900 text-slate-50 font-bold hover:bg-slate-700"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>

        {students &&
          students.map((student, key) => {
            return (
              <StudentItem
                onChange={async () => await getStudents()}
                key={key}
                data={student}
              />
            );
          })}
      </div>
    </div>
  );
}
