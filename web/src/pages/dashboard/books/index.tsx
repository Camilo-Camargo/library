import { useEffect, useState } from "react";
import { apiGet, apiPostFormData } from "../../../services/api";
import { Book } from "../../../types/book";
import { Counter } from "../../../components/Counter";
import { BookItem } from "../components/Book";
import { handleUpload } from "../../../utils/Handlers";
import { Modal } from "../../../components/Modal";

export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("quantity", quantity.toString());
    formData.append("location", location);
    if (cover) {
      formData.append("cover", cover);
    }

    const res = await apiPostFormData("/api/book", formData);
    if (res.ok) {
      await getBooks();
      setCreateModalOpen(false);
    }
  };

  const handleUploadFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await apiPostFormData("/api/book/from-files", formData);
    if (res.ok) {
      await getBooks();
      setImportModalOpen(false);
    } else {
      console.error("Failed to upload files");
    }
  };

  const getBooks = async () => {
    const res = await apiGet("/api/book");
    const resData = await res.json();
    setBooks(resData);
    setFilteredBooks(resData);
  };

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, books]);

  return (
    <div className="flex flex-col h-full w-full gap-4 p-6 bg-white text-black">
      <div className="flex flex-wrap gap-10 items-center">
        <input
          type="text"
          placeholder="Search books by title"
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-col gap-2 w-full">
          <button
            className="border rounded-lg p-2 bg-primary text-white font-bold hover:bg-primary-dark w-full transition"
            onClick={() => setCreateModalOpen(true)}
          >
            Create Book
          </button>
          <button
            className="border rounded-lg p-2 bg-secondary text-white font-bold hover:bg-green-500 w-full transition"
            onClick={() => setImportModalOpen(true)}
          >
            Import Books from CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full gap-8 h-full overflow-y-auto">
        {filteredBooks.map((book, key) => (
          <BookItem
            onChange={async () => await getBooks()}
            key={key}
            data={book}
          />
        ))}
      </div>

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-4">Create Book</h2>
        <div>
          {cover && (
            <img
              className="w-[180px] h-[270px] m-auto rounded-lg object-cover"
              src={URL.createObjectURL(cover)}
            />
          )}
          {!cover && (
            <div
              className="flex justify-center items-center bg-gray-100 text-gray-500 text-center w-[180px] h-[270px] rounded-lg m-auto border-dashed border cursor-pointer"
              onClick={async () => setCover(await handleUpload() as File)}
            >
              <span className="font-bold">Upload Cover</span>
            </div>
          )}
        </div>

        <input
          className="border p-2 rounded-lg mb-2 w-full"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg mb-2 w-full"
          placeholder="Author"
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Counter min={1} onChange={(c) => setQuantity(c)} />
        <input
          className="border p-2 rounded-lg mb-2 w-full"
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          className="border rounded-lg p-2 bg-primary text-white font-bold hover:bg-primary-dark w-full transition"
          onClick={handleCreate}
        >
          Create
        </button>
        </div>
      </Modal>

      <Modal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Import Books from CSV</h2>
        <input
          type="file"
          accept=".csv"
          className="border rounded-lg mb-2 w-full"
          onChange={(e) => {
            if (e.target.files) {
              setFiles(Array.from(e.target.files));
            }
          }}
        />
        <button
          className="border rounded-lg p-2 bg-secondary text-white font-bold hover:bg-green-500 w-full transition mt-4"
          onClick={handleUploadFiles}
        >
          Upload
        </button>
      </Modal>
    </div>
  );
}
