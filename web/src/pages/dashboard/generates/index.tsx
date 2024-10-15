import { useState } from "react";
import { Button } from "../../../components/Button";
import { apiPost } from "../../../services/api";

export default function GeneratesPage() {
  const [loading, setLoading] = useState(false);

  const onDownloadBorrowPDF = async () => {
    setLoading(true);
    try {
      const response = await apiPost('/api/borrow/pdf');

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const fileName = `borrrows_${timestamp}.pdf`;

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
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full gap-4 p-4 md:p-6">
      <Button 
        title={loading ? "Loading..." : "Download Borrow PDF"} 
        variant="primary" 
        onClick={onDownloadBorrowPDF} 
      />
    </div>
  );
}
