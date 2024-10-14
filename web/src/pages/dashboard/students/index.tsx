import { useAtom } from "jotai";
import { UserAtom } from "../../../storage/global";
import { useEffect, useState } from "react";
import { apiGet, apiPostFormData } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types/book";
import { handleUpload } from "../../../utils/Handlers";
import { Counter } from "../../../components/Counter";
import { StudentItem } from "../components/Student";
import { UserIdentificationType } from "../../../types/enum";

export function Students() {
  const navigate = useNavigate();

  const [user, _setUser] = useAtom(UserAtom);
  const [students, setStudents] = useState<User[]>([]);

  const [fullname, setFullname] = useState("");
  const [grade, setGrade] = useState(1);
  const [identification, setIdentification] = useState("");
  const [identificationType, setIdentificationType] = useState<UserIdentificationType>();
  const [code, setCode] = useState("");
  const [age, setAge] = useState(1);
  const [profileImage, setProfileImage] = useState<File | null>();
  const [csvFile, setCsvFile] = useState<File | null>(null); // New state for CSV file

  const getStudents = async () => {
    const res = await apiGet("/api/student");
    const resData = await res.json();
    setStudents(resData);
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("identification", identification);
    formData.append("identificationType", identificationType!.toString());
    formData.append("code", code);
    formData.append("age", age.toString());
    formData.append("grade", grade.toString());
    formData.append("profileImage", profileImage!);

    const res = await apiPostFormData("/api/register", formData);
    const resJson = await res.json();
    if (resJson.id) {
      await getStudents();
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append("files", csvFile);

    const res = await apiPostFormData("/api/student/from-files", formData);
    if (res.ok) {
      await getStudents();
    } else {
      console.error("Error uploading CSV file");
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") navigate("/");
    getStudents();
  }, []);

  if (!user) return null;

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
                className="flex justify-center items-center bg-slate-900 text-slate-50 text-center w-[120px] h-[120px] rounded-lg m-auto border-dashed border cursor-pointer"
                onClick={async () => {
                  setProfileImage((await handleUpload()) as File);
                }}
              >
                <span className="font-bold">Upload Photo</span>
              </div>
            )}
          </div>
          <input
            className="focus:outline-none border p-1 rounded focus:ring-1"
            placeholder="Full name"
            onChange={(e) => setFullname(e.target.value)}
          />
          <input
            className="focus:outline-none border p-1 rounded focus:ring-1"
            placeholder="Code"
            onChange={(e) => setCode(e.target.value)}
          />

          <input
            className="focus:outline-none border p-1 rounded focus:ring-1"
            placeholder="Age"
            type="number"
            min={1}
            max={100}
            onChange={(e) => setAge(parseInt(e.target.value))}
          />
          <input
            className="focus:outline-none border p-1 rounded focus:ring-1"
            placeholder="Identification"
            onChange={(e) => setIdentification(e.target.value)}
          />
          <select
            id="user-identification-type"
            value={identificationType || ''}
            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setIdentificationType(e.target.value as UserIdentificationType)}
          >
            <option value="" disabled>Select User Identification Type</option>
            {Object.values(UserIdentificationType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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

        <div className="flex flex-col gap-2 w-[180px]">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              if (e.target.files) {
                setCsvFile(e.target.files[0]);
              }
            }}
          />
          <button
            className="border rounded p-2 bg-green-600 text-slate-50 font-bold hover:bg-green-500"
            onClick={handleCsvUpload}
          >
            Import Students from CSV
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
