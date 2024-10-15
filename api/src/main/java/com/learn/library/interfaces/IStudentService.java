package com.learn.library.interfaces;

import java.util.List;

import com.learn.library.dto.CreateBorrowReq;
import com.learn.library.model.Borrow;
import com.learn.library.model.Student;

public interface IStudentService {
	public Borrow borrowBook(Student student, CreateBorrowReq req);

	public List<Student> findAll();

	public Student create(Student student);

	public void update(Student student);

	public void delete(Student student);

	public Student findById(Long id);

	public Student findByCode(String code);

	public Student findByUserId(Long id);

	public List<Borrow> findAllBorrowsById(Long id);
}
