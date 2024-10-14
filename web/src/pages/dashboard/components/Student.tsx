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
import { UserIdentificationType } from "../../../types/enum"; // Import the enum

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

    const res = await apiPutFormData("/api/student", formData);
    const resData = await res.json();
    props.onChange && props.onChange();
  };

  const onDelete = async () => {
    const res = await apiDelete("/api/student", { id: props.data.id });
    const resData = await res.json();
    props.onChange && props.onChange();
  };

  return (
    <div className="flex flex-col gap-2 w-[180px]">
      <div className="flex flex-col gap-2">
        {profileImage && (
          <img
            className="w-[120px] h-[120px] m-auto rounded-lg object-cover border"
            onClick={async () => {
              setProfileImage((await handleUpload()) as File);
            }}
            src={
              typeof profileImage === "string"
                ? apiResourceUrl(profileImage)
                : URL.createObjectURL(profileImage)
            }
            alt="Profile"
          />
        )}

        {!profileImage && (
          <div
            className="flex justify-center items-center bg-slate-900 text-slate-50 text-center w-[120px] h-[120px] rounded-lg m-auto border border-dashed"
            onClick={async () => {
              // TODO: Remove casting
              setProfileImage((await handleUpload()) as File);
            }}
          >
            <span className="font-bold">Upload Cover</span>
          </div>
        )}

        <span>{props.data.username}</span>

        <input
          className="focus:outline-none border p-1 rounded focus:ring-1"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => {
            setFullname(e.target.value);
          }}
        />

        <input
          className="focus:outline-none border p-1 rounded focus:ring-1"
          placeholder="Identification"
          value={identification}
          onChange={(e) => {
            setIdentification(e.target.value);
          }}
        />

        <input
          className="focus:outline-none border p-1 rounded focus:ring-1"
          placeholder="Code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />

        <input
          className="focus:outline-none border p-1 rounded focus:ring-1"
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
          className="border p-2 rounded focus:outline-none focus:ring-1"
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
      </div>

      <div className="flex flex-col gap-2">
        <Counter
          defaultValue={grade}
          max={12}
          min={1}
          onChange={(c) => setGrade(c)}
        />
      </div>

      <Button title="Update" onClick={onUpdate} variant="primary" />
      <Button title="Delete" onClick={onDelete} variant="danger-border" />
    </div>
  );
}
