package com.learn.library.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.learn.library.dto.CreateBorrowReq;
import com.learn.library.dto.book.CreateBookReq;
import com.learn.library.interfaces.IStudentService;
import com.learn.library.model.Book;
import com.learn.library.model.Borrow;
import com.learn.library.model.Student;
import com.learn.library.repositories.StudentRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService implements IStudentService {
	@Autowired
	private StudentRepository repository;

	@Autowired
	private BorrowService borrowService;

	@Autowired
	private BookService bookService;

	@Override
	public Student create(Student student) {
		return repository.save(student);
	}

	@Override
	public void update(Student student) {
		repository.save(student);
	}

	@Override
	public void delete(Student student) {
		repository.delete(student);
	}

	@Override
	public Student findById(Long id) {
		Optional<Student> student = this.repository.findById(id);

		if (student.isEmpty())
			return null;

		return student.get();
	}

	@Override
	public List<Borrow> findAllBorrowsById(Long id) {
		if (findById(id) == null)
			return null;
		return borrowService.findAllByStudentId(id);
	}

	public Borrow borrowBook(Student student, CreateBorrowReq req) {
		Book book = bookService.findById(req.bookId);

		if (book == null) {
			throw new IllegalArgumentException("Book doesn't exist");
		}

		if (book.getQuantity() == 0) {
			throw new IllegalArgumentException("There aren't available books to borrow.");
		}

		if (req.quantity > book.getQuantity()) {
			throw new IllegalArgumentException("Insufficient books available to borrow.");
		}

		LocalDate now = LocalDate.now();
		Borrow borrow = new Borrow(req.quantity, now, req.returnDate, req.observations, book, student);
		borrow.setCreatedAt(now);
		borrowService.create(borrow);
		book.setQuantity(book.getQuantity() - req.quantity);
		bookService.update(book);
		return borrow;
	}

	@Override
	public Student findByUserId(Long id) {
		return repository.findByUserId(id);
	}

	@Override
	public List<Student> findAll() {
		return repository.findAll();
	}

	@Override
	public Student findByCode(String code) {
		return repository.findByCode(code);
	}

}
