import { useEffect, useState } from "react";
import { apiGet } from "../../../services/api";
import { useAtom } from "jotai";
import { UserAtom } from "../../../storage/global";
import { Book } from "../../../types/book";
import { BookItem } from "../components/Book";

export function Borrows() {
  const [user, _setUser] = useAtom(UserAtom);
  const [books, setBooks] = useState<Book[]>();

  const getBooksBorrows = async () => {
    if (!user) return;
    let res: Response;
    if (user.role === "admin") {
      res = await apiGet(`/api/borrow`);
    } else {
      res = await apiGet(`/api/student/${user.id}/borrow`);
    }
    
    const resData = await res.json();
    setBooks(resData);
    console.log(resData);
  };

  useEffect(() => {
    getBooksBorrows();
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-4">
      <div className="flex flex-wrap gap-10 items-center pl-4 pt-4 overflow-auto">
        {books &&
          books.map((book, key) => {
            return (
              <BookItem
                borrow
                onChange={async () => await getBooksBorrows()}
                key={key}
                data={book}
              />
            );
          })}
      </div>
    </div>
  );
}
