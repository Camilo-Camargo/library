package com.learn.library.controller;

import java.io.ByteArrayOutputStream;
import java.util.List;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Font;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.learn.library.dto.CreateBorrowReq;
import com.learn.library.dto.borrow.BorrowRes;
import com.learn.library.dto.borrow.UpdateBorrowReq;
import com.learn.library.model.Book;
import com.learn.library.model.Borrow;
import com.learn.library.model.Student;
import com.learn.library.services.BookService;
import com.learn.library.services.BorrowService;
import com.learn.library.services.StudentService;

@RestController
public class BorrowController {
    @Autowired
    private BorrowService service;

    @Autowired
    private StudentService studentService;

    @Autowired
    private BookService bookService;

    @GetMapping("api/borrow")
    public ResponseEntity<List<BorrowRes>> findAll() {
        return ResponseEntity.status(HttpStatus.OK).body(BorrowRes.fromEntities(service.findAll()));
    }

    @PostMapping("api/borrow")
    public ResponseEntity<BorrowRes> create(
            @RequestBody CreateBorrowReq req) {

        Student student = studentService.findByUserId(req.studentId);

        Borrow borrow;

        try {
            borrow = studentService.borrowBook(student, req);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        return ResponseEntity.status(HttpStatus.OK).body(BorrowRes.fromEntity(borrow));
    }

    @PutMapping("api/borrow")
    public ResponseEntity<BorrowRes> update(@RequestBody UpdateBorrowReq req) {
        Borrow borrow = service.findById(req.id);
        if (borrow == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (borrow.getQuantity() == req.quantity) {
            return ResponseEntity.ok().build();
        }

        Book book = borrow.getBook();

        int diff = req.quantity - borrow.getQuantity();

        borrow.setQuantity(borrow.getQuantity() + diff);

        if (borrow.getQuantity() < 1) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        book.setQuantity(book.getQuantity() - diff);

        borrow.setReturnDate(req.returnDate);
        service.update(borrow);
        bookService.update(book);

        return ResponseEntity.ok(BorrowRes.fromEntity(borrow));
    }

    @DeleteMapping("api/borrow/{id}")
    public ResponseEntity<BorrowRes> unBorrow(@PathVariable Long id) {
        Borrow borrow = service.findById(id);
        if (borrow == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Book book = borrow.getBook();
        book.setQuantity(book.getQuantity() + borrow.getQuantity());

        bookService.update(book);
        service.unBorrow(borrow);
        return ResponseEntity.ok(BorrowRes.fromEntity(borrow));
    }

    @PostMapping("api/borrow/pdf")
    public ResponseEntity<byte[]> createPdf() {
        List<Borrow> borrows = service.findAll();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document();

        try {
            PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();

            Font smallFont = new Font(Font.FontFamily.HELVETICA, 10);
            PdfPTable table = new PdfPTable(9);
            table.setWidthPercentage(100);
            table.addCell(new PdfPCell(new Phrase("ID del Préstamo", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Título del Libro", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Nombre del Estudiante", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Fecha de Préstamo", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Fecha de Devolución", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Fecha de Vencimiento", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Cantidad Prestada", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Observaciones", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Estado del Préstamo", smallFont)));

            for (Borrow borrow : borrows) {
                table.addCell(new PdfPCell(new Phrase(String.valueOf(borrow.getId()), smallFont)));
                table.addCell(new PdfPCell(new Phrase(borrow.getBook().getTitle(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(borrow.getStudent().getUser().getFullname(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(borrow.getBorrowDate().toString(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(
                        borrow.getReturnedAt() != null ? borrow.getReturnedAt().toString() : "N/A", smallFont)));
                table.addCell(new PdfPCell(new Phrase(
                        borrow.getReturnDate() != null ? borrow.getReturnDate().toString() : "N/A", smallFont)));
                table.addCell(new PdfPCell(new Phrase(String.valueOf(borrow.getQuantity()), smallFont)));
                table.addCell(new PdfPCell(new Phrase(borrow.getObservations(), smallFont)));
                String stateInSpanish;
                switch (borrow.getState()) {
                    case CheckOut:
                        stateInSpanish = "Prestado";
                        break;
                    case Returned:
                        stateInSpanish = "Devuelto";
                        break;
                    default:
                        stateInSpanish = "Desconocido"; // Fallback for safety
                }
                table.addCell(new PdfPCell(new Phrase(stateInSpanish, smallFont)));
            }

            document.add(table);
            document.close();

            byte[] pdfBytes = byteArrayOutputStream.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=borrows.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (DocumentException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } finally {
            document.close();
        }
    }
}
