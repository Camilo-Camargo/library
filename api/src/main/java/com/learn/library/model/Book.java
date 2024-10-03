package com.learn.library.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table
public class Book {
  public Book() {
  }

  public Book(
      String title,
      String author,
      String cover,
      int quantity,
      String location) {
    this.title = title;
    this.author = author;
    this.cover = cover;
    this.quantity = quantity;
    this.location = location;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "book_id")
  private Long id;

  private String title;

  @Column
  private String author;

  @Column
  private String cover;

  @Column
  private int quantity;

  @Column
  private String location;

  @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
  private List<Borrow> borrows;
}
