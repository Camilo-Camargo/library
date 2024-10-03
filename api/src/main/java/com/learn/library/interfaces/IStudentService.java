package com.learn.library.interfaces;


import java.util.List;

import com.learn.library.model.Borrow;
import com.learn.library.model.Student;

public interface IStudentService {
	public Borrow borrowBook(Student student, Long bookId, int quantity);

	public List<Student> findAll();

	public Student create(Student student);

	public void update(Student student);

	public void delete(Student student);

	public Student findById(Long id);

	public Student findByUserId(Long id);

	public List<Borrow> findAllBorrowsById(Long id);
}