import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { UserAtom } from "../../../storage/global";
import {
  apiGet,
  apiPostFormData,
} from "../../../services/api";
import { Book } from "../../../types/book";
import { handleUpload } from "../../../utils/Handlers";
import { Counter } from "../../../components/Counter";
import { BookItem } from "../components/Book";

export function Books() {
  const [user, _setUser] = useAtom(UserAtom);
  const [books, setBooks] = useState<Book[]>();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [cover, setCover] = useState<File | null>();

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("quantity", quantity.toString());
    formData.append("location", location);
    formData.append("cover", cover!);

    const res = await apiPostFormData("/api/book", formData);
    const resJson = await res.json();
    if (resJson.id) {
      await getBooks();
    }
  };

  const getBooks = async () => {
    const res = await apiGet("/api/book");
    const resData = await res.json();
    setBooks(resData);
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-4">
      <div className="flex flex-wrap gap-10 items-center pl-4 pt-4 overflow-auto">
        {user?.role === "admin" && (
          <div className="flex flex-col gap-2 w-[180px]">
            <input
              className="focus:outline-none border p-1 rounded focus:ring-1"
              placeholder="Title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <input
              className="focus:outline-none border p-1 rounded focus:ring-1"
              placeholder="Author"
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
            <div>
              {cover && (
                <img
                  className="w-[180px] h-[270px] m-auto rounded-lg object-cover"
                  src={URL.createObjectURL(cover)}
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
            </div>
            <Counter min={1} onChange={(c) => setQuantity(c)} />
            <input
              className="focus:outline-none border p-1 rounded focus:ring-1"
              placeholder="Location"
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
            <button
              className="border rounded p-2 bg-slate-900 text-slate-50 font-bold hover:bg-slate-700"
              onClick={handleCreate}
            >
              Create
            </button>
            `
          </div>
        )}

        {books &&
          books.map((book, key) => {
            return (
              <BookItem
                onChange={async () => await getBooks()}
                key={key}
                data={book}
              />
            );
          })}
      </div>
    </div>
  );
}