package com.learn.library.controller;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.learn.library.dto.book.BookRes;
import com.learn.library.dto.book.DeleteBookReq;
import com.learn.library.model.Book;
import com.learn.library.services.BookService;
import com.learn.library.services.FileService;

@RestController
public class BookController {
    @Autowired
    private BookService service;

    @Autowired
    private FileService fileService;

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

    @PostMapping(value = "api/book", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<BookRes> create(
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            MultipartFile cover,
            @RequestParam("quantity") int quantity,
            @RequestParam("location") String location) {

        String originalFilename = cover.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // Get file extension
        }

        String timestamp = String.valueOf(Instant.now().toEpochMilli());

        String imagePath = "books/" + timestamp + extension;

        try {
            imagePath = "/" + fileService.saveFile(cover, imagePath);
        } catch (IOException e) {
            System.err.println("File upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        Book book = new Book(title, author, imagePath, quantity, location);
        book = service.create(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(BookRes.fromEntity(book));
    }

    @PutMapping("api/book")
    public ResponseEntity<BookRes> update(
            @RequestParam("id") Long id,
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam(value = "cover", required = false) MultipartFile cover,
            @RequestParam("quantity") int quantity,
            @RequestParam("location") String location) {

        Book bookFound = service.findById(id);
        if (bookFound == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        String imagePath = bookFound.getCover();

        if (cover != null) {

            String originalFilename = cover.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // Get file extension
            }

            String timestamp = String.valueOf(Instant.now().toEpochMilli());

            imagePath = "books/" + timestamp + extension;

            try {
                imagePath = "/" + fileService.saveFile(cover, imagePath);
            } catch (IOException e) {
                System.err.println("File upload failed: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        bookFound.setTitle(title);
        bookFound.setAuthor(author);
        bookFound.setQuantity(quantity);
        bookFound.setLocation(location);
        bookFound.setCover(imagePath);
        service.update(bookFound);
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
