package com.learn.library.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.learn.library.model.Borrow;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    @Query("SELECT b FROM Borrow b WHERE b.student.id = :studentId AND b.state = 0")
    List<Borrow> findAllByStudentId(@Param("studentId") Long studentId);
}
