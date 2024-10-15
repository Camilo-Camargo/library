import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../../services/api";
import { useAtom } from "jotai";
import { UserAtom } from "../../../storage/global";
import { Book } from "../../../types/book";
import { BookItem } from "../components/Book";
import { Counter } from "../../../components/Counter";

export function Borrows() {
  const [user] = useAtom(UserAtom);
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>();
  const [selectedBookId, setSelectedBookId] = useState<number | undefined>();
  const [returnDate, setReturnDate] = useState("");
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [observations, setObservations] = useState(""); // Fixed the typo here
  const [quantity, setQuantity] = useState(1);
  const [studentSearch, setStudentSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const fetchBooks = async () => {
    const res = await apiGet("/api/book/availables");
    setBooks(await res.json());
  };

  const fetchStudents = async () => {
    const res = await apiGet("/api/student");
    setStudents(await res.json());
  };

  const fetchBorrowedBooks = async (studentId: number) => {
    try {
      const res = await apiGet(`/api/student/${studentId}/borrow`);
      const resData = await res.json();
      setBorrowedBooks(Array.isArray(resData) ? resData : []);
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error);
      setBorrowedBooks([]);
    }
  };

  const handleStudentChange = (e?: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e ? Number(e.target.value) : selectedStudentId;
    setSelectedStudentId(studentId);
    if (studentId) {
      fetchBorrowedBooks(studentId);
    }
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBookId(Number(e.target.value));
  };

  const handleBorrowBook = async () => {
    if (!selectedStudentId || !selectedBookId || !returnDate || quantity <= 0) return;

    const res = await apiPost("/api/borrow", {
      studentId: selectedStudentId,
      bookId: selectedBookId,
      quantity,
      returnDate,
      observations, // Include observations here
    });

    if (res.ok) {
      await fetchBooks();
      fetchBorrowedBooks(selectedStudentId);
      resetFields();
    }
  };

  const resetFields = () => {
    setSelectedBookId(undefined);
    setReturnDate("");
    setQuantity(1);
    setObservations(""); // Reset observations as well
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchBooks();
      fetchStudents();
    }
  }, [user]);

  const filteredStudents = students.filter(student =>
    student.fullname.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(bookSearch.toLowerCase())
  );

  useEffect(() => {
    if (selectedStudentId && !filteredStudents.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(undefined);
    }
  }, [studentSearch, filteredStudents, selectedStudentId]);

  useEffect(() => {
    if (selectedBookId && !filteredBooks.some(b => b.id === selectedBookId)) {
      setSelectedBookId(undefined);
    }
  }, [bookSearch, filteredBooks, selectedBookId]);

  return (
    <div className="flex flex-col h-full w-full gap-4 p-4 md:p-6">
      {user?.role === "admin" && (
        <div className="flex items-center mb-4 flex-wrap">
          <label htmlFor="student-search" className="mr-2">Search Student:</label>
          <input
            type="text"
            id="student-search"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="border p-2 rounded w-full max-w-xs mb-2"
            placeholder="Type to search"
          />
          <label htmlFor="student-select" className="mr-2">Select Student:</label>
          <select
            id="student-select"
            value={selectedStudentId || ''}
            onChange={handleStudentChange}
            className="border p-2 rounded w-full max-w-xs mb-2"
          >
            <option value="" disabled>Select a student</option>
            {filteredStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullname}
              </option>
            ))}
          </select>
        </div>
      )}

      {user?.role === "admin" && selectedStudentId && (
        <div className="flex flex-col gap-2 mb-4">
          <h3 className="font-bold">Borrow Book:</h3>
          <input
            type="text"
            value={bookSearch}
            onChange={(e) => setBookSearch(e.target.value)}
            className="border p-2 rounded mb-2"
            placeholder="Type to search books"
          />
          <select
            value={selectedBookId || ''}
            onChange={handleBookChange}
            className="border p-2 rounded mb-2"
          >
            <option value="" disabled>Select a book</option>
            {filteredBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="border p-2 rounded mb-2"
          />
          <Counter
            defaultValue={quantity}
            min={1}
            max={books.find(book => book.id === selectedBookId)?.quantity || 1}
            onChange={setQuantity}
          />
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="border p-2 rounded mb-2"
            placeholder="Add observations (optional)"
          />
          <button
            onClick={handleBorrowBook}
            className="border rounded p-2 bg-slate-900 text-slate-50 font-bold hover:bg-slate-700"
          >
            Borrow Book
          </button>
        </div>
      )}

      {selectedStudentId && (
        <div className="mt-4">
          <h3 className="font-bold">Books Borrowed by {students.find(s => s.id === selectedStudentId)?.fullname}:</h3>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {borrowedBooks.map((book, index) => (
              <BookItem
                key={index}
                borrow
                onChange={() => handleStudentChange()}
                data={book}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
