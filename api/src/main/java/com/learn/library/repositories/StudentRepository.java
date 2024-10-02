package com.learn.library.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.learn.library.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {}