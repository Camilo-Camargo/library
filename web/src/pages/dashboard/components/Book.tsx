import { useAtom } from "jotai";
import { useState } from "react";
import { UserAtom } from "../../../storage/global";
import {
  apiDelete,
  apiPost,
  apiPut,
  apiPutFormData,
  apiResourceUrl,
} from "../../../services/api";
import { Book } from "../../../types/book";
import { handleUpload } from "../../../utils/Handlers";
import { Button } from "../../../components/Button";
import { Counter } from "../../../components/Counter";

export type BookItemProps = {
  borrow?: boolean;
  data: Book;
  onChange?: () => void;
};

export function BookItem(props: BookItemProps) {
  const [user, _setUser] = useAtom(UserAtom);

  const [title, setTitle] = useState(props.data.title);
  const [author, setAuthor] = useState(props.data.author);
  const [quantity, setQuantity] = useState(props.data.quantity);
  const [location, setLocation] = useState(props.data.location);
  const [cover, setCover] = useState<string | File>(props.data.cover);
  const [returnDate, setReturnDate] = useState<string>(
    props.data.returnDate ?? ""
  );

  const onUpdate = async () => {
    const formData = new FormData();
    formData.append("id", (props.data.id).toString());
    formData.append("title", title);
    formData.append("author", author);
    formData.append("quantity", quantity.toString());
    console.log(cover);
    if(typeof cover !== "string") formData.append("cover", cover);
    formData.append("location", location);

    const res = await apiPutFormData("/api/book", formData);
    const resData = await res.json();
    console.log(resData);
    props.onChange && props.onChange();
  };
  const onDelete = async () => {
    console.log("deleting...");
    const res = await apiDelete("/api/book", { id: props.data.id });
    const resData = await res.json();
    console.log(resData);
    props.onChange && props.onChange();
  };
  const onReserve = async () => {
    const res = await apiPost("/api/borrow", {
      studentId: user!.id,
      bookId: props.data.id,
      quantity: quantity,
      returnDate: returnDate,
    });
    const resData = await res.json();
    console.log(resData);
    props.onChange && props.onChange();
  };
  const onUnreserve = async () => {
    const res = await apiDelete(`/api/borrow/${props.data.id}`);
    const resData = await res.json();
    console.log(resData);
    props.onChange && props.onChange();
  };

  const onBorrowUpdate = async () => {
    const res = await apiPut("/api/borrow", {
      id: props.data.id,
      quantity,
      returnDate: returnDate,
    });

    if(res.status != 200){
      console.log(await res.text());
      return;
    }

    const resData = await res.json();
    console.log(resData);
    props.onChange && props.onChange();
  };

  return (
    <div className="flex flex-col gap-2 w-[180px]">
      <div className="flex flex-col gap-2">
        {user?.role === "admin"  && !props.borrow ? (
          <>
            <input
              className="focus:outline-none border p-1 rounded focus:ring-1"
              placeholder="Title"
              defaultValue={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <input
              className="focus:outline-none border p-1 rounded focus:ring-1"
              placeholder="Author"
              defaultValue={author}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
          </>
        ) : (
          <>
            <span className="font-bold">{title}</span>
            <span className="font-thin">{author}</span>
          </>
        )}
      </div>

      {cover && (
        <img
          className="w-[180px] h-[270px] m-auto rounded-lg object-cover"
          onClick={async () => {
            if (props.borrow) return;
            setCover((await handleUpload()) as File);
          }}
          src={
            typeof cover === "string"
              ? apiResourceUrl(cover)
              : URL.createObjectURL(cover)
          }
        />
      )}

      {!cover && (
        <div
          className="flex justify-center items-center bg-slate-900 text-slate-50 text-center w-[180px] h-[270px] rounded-lg m-auto border border-dashed"
          onClick={async () => {
            // TODO: Remove casting
            setCover((await handleUpload()) as File);
          }}
        >
          <span className="font-bold">Upload Cover</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {user?.role !== "admin" && (
          <input
            defaultValue={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            type="date"
            className="w-full p-2 border rounded"
          />
        )}

        <Counter
          defaultValue={quantity}
          max={props.data.quantity}
          min={1}
          onChange={(c) => setQuantity(c)}
        />
        {!props.borrow && (
          <input
            className="focus:outline-none border p-1 rounded focus:ring-1"
            placeholder="Location"
            defaultValue={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        )}
      </div>

      {user?.role === "admin" && props.borrow && <div className="flex gap-2">
        <img className="w-8 h-8 rounded-full border" src={apiResourceUrl(props.data.student.profileImage)}></img>
        <span>{props.data.student.fullname}</span>
      </div>}

      {user?.role === "admin" && !props.borrow ? (
        <>
          <Button title="Update" onClick={onUpdate} variant="primary" />
          <Button title="Delete" onClick={onDelete} variant="danger-border" />
        </>
      ) : props.borrow ? (
        <>
          <Button
            title="Update"
            onClick={onBorrowUpdate}
            variant="primary-border"
          />
          <Button
            title="Unreserve"
            onClick={onUnreserve}
            variant="danger-border"
          />
        </>
      ) : (
        <Button title="Reserve" onClick={onReserve} variant="secondary" />
      )}
    </div>
  );
}
