import { useState, useEffect } from "react";
import { Button } from "../../../components/Button";
import { apiPost, apiGet } from "../../../services/api";
import { useLanguage } from "../../../i18n/LanguageContext";

interface Book {
  title: string;
}

interface Student {
  fullname: string;
}

interface Borrow {
  id: number;
  book: Book;
  student: Student;
  borrowDate: string;
  returnedAt: string | null;
  returnDate: string | null;
  quantity: number;
  observations: string;
  state: "CheckOut" | "Returned";
}

export default function GeneratesPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);

  const fetchBorrowsFromLastMonth = async () => {
    setLoading(true);
    try {
      const response = await apiGet("/api/borrow/last-month");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Borrow[] = await response.json();
      setBorrows(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDownloadBorrowPDF = async () => {
    setLoadingPdf(true);
    try {
      const response = await apiPost("/api/borrow/pdf");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const fileName = `borrows_${timestamp}.pdf`;
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoadingPdf(false);
    }
  };

  useEffect(() => {
    fetchBorrowsFromLastMonth();
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-4 p-4 md:p-6">
      <Button
        title={loadingPdf ? language.DOWNLOADING : language.DOWNLOAD_BORROW_PDF}
        variant="primary"
        onClick={onDownloadBorrowPDF}
      />
      {loading ? (
        <p>{language.LOADING_BORROWS}</p>
      ) : borrows.length > 0 ? (
        <table className="table-auto w-full border">
          <thead>
            <tr className="border">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">{language.BOOK_TITLE}</th>
              <th className="px-4 py-2 border">{language.STUDENT_FULLNAME}</th>
              <th className="px-4 py-2 border">{language.BORROW_DATE}</th>
              <th className="px-4 py-2 border">{language.RETURN_DATE}</th>
              <th className="px-4 py-2 border">{language.DUE_DATE}</th>
              <th className="px-4 py-2 border">{language.BOOK_QUANTITY}</th>
              <th className="px-4 py-2 border">{language.OBSERVATIONS}</th>
              <th className="px-4 py-2 border">{language.STATUS}</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((borrow) => (
              <tr key={borrow.id} className="border">
                <td className="px-4 py-2 border">{borrow.id}</td>
                <td className="px-4 py-2 border">{borrow.book.title}</td>
                <td className="px-4 py-2 border">{borrow.student.fullname}</td>
                <td className="px-4 py-2 border">{borrow.borrowDate}</td>
                <td className="px-4 py-2 border">
                  {borrow.returnedAt ? borrow.returnedAt : language.NA}
                </td>
                <td className="px-4 py-2 border">
                  {borrow.returnDate ? borrow.returnDate : language.NA}
                </td>
                <td className="px-4 py-2 border">{borrow.quantity}</td>
                <td className="px-4 py-2 border">{borrow.observations}</td>
                <td className="px-4 py-2 border">
                  {borrow.state === "CheckOut"
                    ? language.STATUS_BORROWED
                    : language.STATUS_RETURNED}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{language.NO_BORROWS}</p>
      )}
    </div>
  );
}
