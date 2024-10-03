package com.learn.library.interfaces;

import java.util.List;

import com.learn.library.model.Borrow;

public interface IBorrowService {
	public Borrow create(Borrow borrow);

	public List<Borrow> findAll();

	public void update(Borrow borrow);

	public void delete(Borrow borrow);

	public Borrow findById(Long id);

	public List<Borrow> findAllByStudentId(Long studentId);
}
