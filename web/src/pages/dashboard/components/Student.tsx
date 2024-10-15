import { useState } from "react";
import {
  apiDelete,
  apiPutFormData,
  apiResourceUrl,
} from "../../../services/api";
import { User } from "../../../types/book";
import { handleUpload } from "../../../utils/Handlers";
import { Button } from "../../../components/Button";
import { Counter } from "../../../components/Counter";
import { UserIdentificationType } from "../../../types/enum";

export type StudentItemProps = {
  data: User;
  onChange?: () => void;
};

export function StudentItem(props: StudentItemProps) {
  const [fullname, setFullname] = useState(props.data.fullname);
  const [code, setCode] = useState(props.data.code);
  const [age, setAge] = useState(props.data.age);
  const [identification, setIdentification] = useState(props.data.identification);
  const [grade, setGrade] = useState(props.data.grade);
  const [profileImage, setProfileImage] = useState<string | File>(props.data.profileImage);
  const [identificationType, setIdentificationType] = useState<UserIdentificationType | null>(props.data.identificationType);

  const onUpdate = async () => {
    const formData = new FormData();
    formData.append("id", props.data.id.toString());
    formData.append("fullname", fullname);
    formData.append("identification", identification);
    formData.append("identificationType", identificationType!.toString());
    formData.append("code", code);
    formData.append("age", age.toString());
    formData.append("grade", grade.toString());

    if (typeof profileImage !== "string") {
      formData.append("profileImage", profileImage);
    }

    await apiPutFormData("/api/student", formData);
    props.onChange && props.onChange();
  };

  const onDelete = async () => {
    await apiDelete("/api/student", { id: props.data.id });
    props.onChange && props.onChange();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex gap-4 items-start">
      {profileImage ? (
        <img
          className="w-24 h-24 rounded-lg object-cover border"
          onClick={async () => {
            setProfileImage((await handleUpload()) as File);
          }}
          src={typeof profileImage === "string" ? apiResourceUrl(profileImage) : URL.createObjectURL(profileImage)}
          alt="Profile"
        />
      ) : (
        <div
          className="flex justify-center items-center bg-gray-300 text-gray-700 text-center w-24 h-24 rounded-lg border border-dashed cursor-pointer"
          onClick={async () => {
            setProfileImage((await handleUpload()) as File);
          }}
        >
          <span className="font-bold">Upload Image</span>
        </div>
      )}

      <div className="flex-grow">
        <input
          className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <input
          className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Identification"
          value={identification}
          onChange={(e) => setIdentification(e.target.value)}
        />
        <input
          className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Age"
          type="number"
          value={age}
          min={1}
          max={100}
          onChange={(e) => setAge(parseInt(e.target.value))}
        />
        <select
          id="user-identification-type"
          value={identificationType || ''}
          className="w-full border rounded p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setIdentificationType(e.target.value as UserIdentificationType);
          }}
        >
          <option value="" disabled>Select Identification Type</option>
          {Object.values(UserIdentificationType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="mb-4">
          <Counter
            defaultValue={grade}
            max={12}
            min={1}
            onChange={(c) => setGrade(c)}
          />
        </div>

        <div className="flex justify-between">
          <Button title="Update" onClick={onUpdate} variant="primary" />
          <Button title="Delete" onClick={onDelete} variant="danger-border" />
        </div>
      </div>
    </div>
  );
}
