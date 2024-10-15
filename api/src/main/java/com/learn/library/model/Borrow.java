package com.learn.library.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table
public class Borrow {

  public Borrow() {
  }

  public Borrow(int quantity, LocalDate borrowDate ,LocalDate returnDate, String observations,Book book, Student student) {
    this.quantity = quantity;
    this.returnDate = returnDate;
    this.borrowDate = borrowDate;
    this.observations = observations;
    this.book = book;
    this.student = student;
    this.state = BorrowState.CheckOut;
  }

  @Id
  @GeneratedValue
  @Column(name = "borrow_id")
  private Long id;

  @ManyToOne
  @JoinColumn(name = "book_id")
  private Book book;

  @ManyToOne
  @JoinColumn(name = "student_id")
  private Student student;

  @Column
  private int quantity;

  @Lob
  @Column
  private String observations;

  @Column
  private BorrowState state;

  @Column
  private LocalDate returnDate;

  @Column
  private LocalDate borrowDate;

  @Column
  private LocalDate returnedAt;

  @Column
  private LocalDate createdAt;

  @Column
  private LocalDate updatedAt;
}
