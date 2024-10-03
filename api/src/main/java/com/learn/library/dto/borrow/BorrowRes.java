package com.learn.library.dto.borrow;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.learn.library.model.Borrow;
import com.learn.library.dto.book.BookRes;
import com.learn.library.dto.student.StudentRes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BorrowRes {
    private Long id;
    private BookRes book;
    private String title;
    private String author;
    private StudentRes student;
    private String cover;
    private int quantity;
    private LocalDate returnDate;

    // Convert Borrow entity to BorrowRes DTO
    public static BorrowRes fromEntity(Borrow borrow) {
        return new BorrowRes(
                borrow.getId(),
                BookRes.fromEntity(borrow.getBook()),
                borrow.getBook().getAuthor(),
                borrow.getBook().getTitle(),
                StudentRes.fromEntity(borrow.getStudent()),
                borrow.getBook().getCover(),
                borrow.getQuantity(),
                borrow.getReturnDate());
    }

    public static List<BorrowRes> fromEntities(List<Borrow> borrows) {
        List<BorrowRes> borrowsRes = new ArrayList<>();
        for (Borrow borrow : borrows) {
            borrowsRes.add(fromEntity(borrow));
        }
        return borrowsRes;
    }
}