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

import com.learn.library.dto.book.BookRes;
import com.learn.library.dto.book.CreateBookReq;
import com.learn.library.dto.book.DeleteBookReq;
import com.learn.library.dto.book.UpdateBookReq;
import com.learn.library.model.Book;
import com.learn.library.services.BookService;

@RestController
public class BookController {
    @Autowired
    private BookService service;

    @GetMapping("api/book/{id}")
    public ResponseEntity<BookRes> getById(@PathVariable Long id) {
        Book book = service.findById(id);
        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.FOUND).body(BookRes.fromEntity(book));
    }

    @GetMapping("api/book")
    public ResponseEntity<List<BookRes>> findAll() {
        List<Book> book = service.findAvailables();
        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.FOUND).body(BookRes.fromEntities(book));
    }

    @PostMapping("api/book")
    public ResponseEntity<BookRes> create(
            @RequestBody CreateBookReq req) {
        Book book = new Book(req.title, req.author, req.quantity, req.location);
        book = service.create(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(BookRes.fromEntity(book));
    }

    @PutMapping("api/book")
    public ResponseEntity<BookRes> update(
            @RequestBody UpdateBookReq req) {
        Book book = new Book(req.title, req.author, req.quantity, req.location);
        Book bookFound = service.findById(req.id);
        if (bookFound == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        book.setId(req.id);
        service.update(book);
        return ResponseEntity.status(HttpStatus.OK).body(BookRes.fromEntity(bookFound));
    }

    @DeleteMapping("api/book")
    public ResponseEntity<BookRes> delete(
            @RequestBody DeleteBookReq req) {
        Book book = new Book();
        book = service.findById(req.id);
        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        book.setId(req.id);
        service.delete(book);
        return ResponseEntity.status(HttpStatus.OK).body(BookRes.fromEntity(book));
    }
}
