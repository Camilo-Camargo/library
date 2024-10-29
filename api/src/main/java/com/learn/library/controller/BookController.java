package com.learn.library.controller;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;

import java.io.InputStreamReader;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.IOException;
import java.time.Instant;

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

    @GetMapping("api/book/availables")
    public ResponseEntity<List<BookRes>> findAvailables() {
        List<Book> book = service.findAvailables();
        if (book == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.FOUND).body(BookRes.fromEntities(book));
    }

    @GetMapping("api/book")
    public ResponseEntity<List<BookRes>> findAll() {
        List<Book> book = service.findAll();
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
            @RequestParam(value = "cover", required = false) MultipartFile cover,
            @RequestParam("quantity") int quantity,
            @RequestParam("location") String location) {

        String imagePath = "";
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

    @PostMapping(value = "api/book/from-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> fromFiles(@RequestParam("files") MultipartFile[] files) {
        if (files.length == 0) {
            return ResponseEntity.badRequest().build();
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
                String[] headers = reader.readNext();
                if (headers == null || !validateBookColumns(headers)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }

                List<String[]> rows = reader.readAll();

                for (String[] row : rows) {
                    if (row.length < 3) {
                        continue;
                    }

                    String author = row[0].trim();
                    String title = row[1].trim();
                    int quantity;

                    try {
                        quantity = Integer.parseInt(row[2].trim());
                    } catch (NumberFormatException e) {
                        return ResponseEntity.badRequest().build();
                    }

                    String coverPath = "";
                    String location = "";

                    Book book = new Book(title, author, coverPath, quantity, location);
                    service.create(book);
                }
            } catch (IOException | CsvException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private boolean validateBookColumns(String[] headers) {
        if (headers.length != 3)
            return false;

        String autorPattern = ".*\\bAutor\\b.*";
        String tituloPattern = ".*\\bTítulo\\b.*";
        String cantidadPattern = ".*\\bCantidad\\b.*";

        boolean isAutorValid = matchRegex(headers[0], autorPattern);
        boolean isTituloValid = matchRegex(headers[1], tituloPattern);
        boolean isCantidadValid = matchRegex(headers[2], cantidadPattern);
        return isAutorValid && isTituloValid && isCantidadValid;
    }

    private boolean matchRegex(String input, String pattern) {
        Pattern compiledPattern = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE);
        Matcher matcher = compiledPattern.matcher(input.trim());
        return matcher.matches();
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
