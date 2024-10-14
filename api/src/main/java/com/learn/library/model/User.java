package com.learn.library.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table
public class User {
  public User() {
  }

  public User(
      String identification,
      UserIdentificationType identificationType,
      String fullname,
      String username,
      String password,
      String role,
      String profileImage) {
    this.identification = identification;
    this.identificationType = identificationType;
    this.fullname = fullname;
    this.username = username;
    this.password = password;
    this.role = role;
    this.profileImage = profileImage;
  }

  @Id
  @GeneratedValue
  @Column(name = "user_id")
  private Long id;

  @Column(unique = true)
  private String identification;

  @Column
  private UserIdentificationType identificationType;

  @Column
  private String fullname;

  @Column
  private String username;

  @Column(nullable = true)
  private String password;

  @Column(name = "profile_image")
  private String profileImage;

  @Column
  private String role;
}
