package com.learn.library.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.learn.library.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT u FROM Student u WHERE u.user.id = :userId")
    Student findByUserId(
            @Param("userId") Long id);
}