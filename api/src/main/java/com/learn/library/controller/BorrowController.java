package com.learn.library.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
            borrow = studentService.borrowBook(student, req.bookId, req.quantity);
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
    public ResponseEntity<BorrowRes> delete(@PathVariable Long id) {
        Borrow borrow = service.findById(id);
        if (borrow == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Book book = borrow.getBook();
        book.setQuantity(book.getQuantity() + borrow.getQuantity());

        bookService.update(book);
        service.delete(borrow);

        return ResponseEntity.ok(BorrowRes.fromEntity(borrow));
    }

}
