package com.learn.library.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table
public class Borrow {

  public Borrow() {
  }

  public Borrow(int quantity, LocalDate returnDate, Book book, Student student) {
    this.quantity = quantity;
    this.returnDate = returnDate;
    this.book = book;
    this.student = student;
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

  @Column
  private LocalDate returnDate;
}
