package com.learn.library.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table
public class Student {
  public Student() {
  }

  public Student(
      int grade,
      User user) {
    this.grade = grade;
    this.user = user;
  }

  @Id
  @GeneratedValue
  @Column(name = "student_id")
  private Long id;

  @OneToOne
  @JoinColumn(name = "user_id")
  private User user;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "student")
  private List<Borrow> borrows;

  @Column
  private int grade;
}