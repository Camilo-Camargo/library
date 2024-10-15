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
import { Modal } from "../../../components/Modal";

export function Students() {
  const navigate = useNavigate();
  const [user] = useAtom(UserAtom);
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalImportOpen, setModalImportOpen] = useState(false);

  const [fullname, setFullname] = useState("");
  const [grade, setGrade] = useState(1);
  const [identification, setIdentification] = useState("");
  const [identificationType, setIdentificationType] = useState<UserIdentificationType>();
  const [code, setCode] = useState("");
  const [age, setAge] = useState(1);
  const [profileImage, setProfileImage] = useState<File | null>();
  const [csvFile, setCsvFile] = useState<File | null>(null);

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
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const res = await apiPostFormData("/api/register", formData);
    const resJson = await res.json();
    if (resJson.id) {
      await getStudents();
      setModalCreateOpen(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append("files", csvFile);

    const res = await apiPostFormData("/api/student/from-files", formData);
    if (res.ok) {
      await getStudents();
      setModalImportOpen(false);
    } else {
      console.error("Error uploading CSV file");
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") navigate("/");
    getStudents();
  }, [user]);

  if (!user) return null;

  const filteredStudents = students.filter(student =>
    student.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full gap-4 p-6 bg-white text-black">
      <div className="flex flex-wrap gap-10 items-center">
        <input
          type="text"
          placeholder="Search students by name"
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-col gap-2 w-full">
          <button
            className="border rounded-lg p-2 bg-primary text-white font-bold hover:bg-primary-dark w-full transition"
            onClick={() => setModalCreateOpen(true)}
          >
            Create Student
          </button>
          <button
            className="border rounded-lg p-2 bg-secondary text-white font-bold hover:bg-green-500 w-full transition"
            onClick={() => setModalImportOpen(true)}
          >
            Import Students
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full gap-8 h-full overflow-y-auto">
        {filteredStudents.map((student, key) => (
          <StudentItem
            onChange={async () => await getStudents()}
            key={key}
            data={student}
          />
        ))}
      </div>

      <Modal isOpen={modalCreateOpen} onClose={() => setModalCreateOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Create Student</h2>
        {profileImage && (
          <img
            className="w-[120px] h-[120px] rounded-lg object-cover border mb-2"
            src={URL.createObjectURL(profileImage)}
          />
        )}
        {!profileImage && (
          <div
            className="flex justify-center items-center bg-gray-100 text-gray-500 text-center w-[120px] h-[120px] rounded-lg border-dashed border cursor-pointer mb-2"
            onClick={async () => {
              setProfileImage((await handleUpload()) as File);
            }}
          >
            <span className="font-bold">Upload Photo</span>
          </div>
        )}
        <input
          className="border p-2 rounded-lg mb-2 w-full"
          placeholder="Full name"
          onChange={(e) => setFullname(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg mb-2 w-full"
          placeholder="Code"
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg mb-2 w-full"
          placeholder="Age"
          type="number"
          min={1}
          max={100}
          onChange={(e) => setAge(parseInt(e.target.value))}
        />
        <input
          className="border p-2 rounded-lg mb-2 w-full"
          placeholder="Identification"
          onChange={(e) => setIdentification(e.target.value)}
        />
        <select
          id="user-identification-type"
          value={identificationType || ''}
          className="border p-2 rounded-lg mb-2 w-full"
          onChange={(e) => setIdentificationType(e.target.value as UserIdentificationType)}
        >
          <option value="" disabled>Select User Identification Type</option>
          {Object.values(UserIdentificationType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <div className="flex flex-col mb-2">
          <span>Grade</span>
          <Counter min={1} max={12} onChange={(c) => setGrade(c)} />
        </div>
        <button
          className="border rounded-lg p-2 bg-primary text-white font-bold hover:bg-primary-dark w-full transition"
          onClick={handleCreate}
        >
          Create
        </button>
      </Modal>

      <Modal isOpen={modalImportOpen} onClose={() => setModalImportOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Import Students from CSV</h2>
        <input
          type="file"
          accept=".csv"
          className="border rounded-lg mb-2 w-full"
          onChange={(e) => {
            if (e.target.files) {
              setCsvFile(e.target.files[0]);
            }
          }}
        />
        <button
          className="border rounded-lg p-2 bg-secondary text-white font-bold hover:bg-green-500 w-full transition"
          onClick={handleCsvUpload}
        >
          Import
        </button>
      </Modal>
    </div>
  );
}
