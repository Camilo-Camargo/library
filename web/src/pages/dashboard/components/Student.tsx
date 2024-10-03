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

export type StudentItemProps = {
  data: User;
  onChange?: () => void;
};

export function StudentItem(props: StudentItemProps) {
  const [fullname, setFullname] = useState(props.data.fullname);
  const [password, setPassword] = useState(props.data.password);
  const [identification, setIdentification] = useState(
    props.data.identification
  );
  const [grade, setGrade] = useState(props.data.grade);
  const [profileImage, setProfileImage] = useState<string | File>(
    props.data.profileImage
  );

  const onUpdate = async () => {
    const formData = new FormData();
    formData.append("id", props.data.id.toString());
    formData.append("fullname", fullname);
    formData.append("identification", identification);
    formData.append("password", password);
    formData.append("grade", grade.toString());

    if (typeof profileImage !== "string")
      formData.append("profileImage", profileImage);

    const res = await apiPutFormData("/api/student", formData);
    const resData = await res.json();
    console.log(resData);
    props.onChange && props.onChange();
  };
  const onDelete = async () => {
    console.log("deleting...");
    const res = await apiDelete("/api/student", { id: props.data.id });
    const resData = await res.json();
    console.log(resData);
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
          placeholder="Title"
          defaultValue={fullname}
          onChange={(e) => {
            setFullname(e.target.value);
          }}
        />

        <input
          className="focus:outline-none border p-1 rounded focus:ring-1"
          placeholder="Author"
          defaultValue={identification}
          onChange={(e) => {
            setIdentification(e.target.value);
          }}
        />
      </div>

      <input
        className="focus:outline-none border p-1 rounded focus:ring-1"
        placeholder="Password"
        defaultValue={password}
        onChange={(e) => {
          setFullname(e.target.value);
        }}
      />

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
