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
  const [user] = useAtom(UserAtom);

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
    if (typeof cover !== "string") formData.append("cover", cover);
    formData.append("location", location);

    const res = await apiPutFormData("/api/book", formData);
    if (res.ok) props.onChange && props.onChange();
  };

  const onDelete = async () => {
    const res = await apiDelete("/api/book", { id: props.data.id });
    if (res.ok) props.onChange && props.onChange();
  };

  const onReserve = async () => {
    const res = await apiPost("/api/borrow", {
      studentId: user!.id,
      bookId: props.data.id,
      quantity: quantity,
      returnDate: returnDate,
    });
    if (res.ok) props.onChange && props.onChange();
  };

  const onUnreserve = async () => {
    const res = await apiDelete(`/api/borrow/${props.data.id}`);
    if (res.ok) props.onChange && props.onChange();
  };

  const onBorrowUpdate = async () => {
    const res = await apiPut("/api/borrow", {
      id: props.data.id,
      quantity,
      returnDate: returnDate,
    });

    if (res.ok) props.onChange && props.onChange();
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg">
      <div className="flex flex-col gap-2 mb-2">
        {user?.role === "admin" && !props.borrow ? (
          <>
            <input
              className="border p-2 rounded focus:ring focus:ring-blue-300"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border p-2 rounded focus:ring focus:ring-blue-300"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </>
        ) : (
          <>
            <span className="font-bold text-lg">{title}</span>
            <span className="text-gray-500">{author}</span>
          </>
        )}
      </div>

      {cover && (
        <img
          className="w-full h-[270px] rounded-lg object-cover mb-2 cursor-pointer "
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
          className="flex justify-center items-center text-gray-700 text-center w-full h-[270px] rounded-lg mb-2 border border-dashed cursor-pointer"
          onClick={async () => {
            setCover((await handleUpload()) as File);
          }}
        >
          <span className="font-bold">Upload Cover</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {user?.role !== "admin" && (
          <input
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            type="date"
            className="border p-2 rounded focus:ring focus:ring-blue-300"
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
            className="border p-2 rounded focus:ring focus:ring-blue-300"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        )}
      </div>

      {user?.role === "admin" && props.borrow && props.data.student && (
        <div className="flex items-center gap-2 mt-2">
          <img className="w-8 h-8 rounded-full border" src={apiResourceUrl(props.data.student.profileImage)} alt={props.data.student.fullname} />
          <span>{props.data.student.fullname}</span>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {user?.role === "admin" && !props.borrow ? (
          <>
            <Button title="Update" onClick={onUpdate} variant="primary" />
            <Button title="Delete" onClick={onDelete} variant="danger-border" />
          </>
        ) : props.borrow ? (
          <>
            <Button title="Update" onClick={onBorrowUpdate} variant="primary-border" />
            <Button title="Unreserve" onClick={onUnreserve} variant="danger-border" />
          </>
        ) : (
          <Button title="Reserve" onClick={onReserve} variant="secondary" />
        )}
      </div>
    </div>
  );
}
