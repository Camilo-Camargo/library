package com.learn.library.dto.book;

import java.util.ArrayList;
import java.util.List;

import com.learn.library.model.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookRes {
    private Long id;
    public String title;
    public String author;
    public String cover;
    public int quantity;
    public String location;

    public static BookRes fromEntity(Book book) {
        return new BookRes(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getCover(),
                book.getQuantity(),
                book.getLocation());
    }

    public static List<BookRes> fromEntities(List<Book> books) {
        List<BookRes> booksRes = new ArrayList<>();
        for (Book book : books) {
            booksRes.add(fromEntity(book));
        }
        return booksRes;
    }
}
