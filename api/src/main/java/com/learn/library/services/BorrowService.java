package com.learn.library.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.learn.library.interfaces.IBorrowService;
import com.learn.library.model.Borrow;
import com.learn.library.model.BorrowState;
import com.learn.library.repositories.BorrowRepository;

@Service
public class BorrowService implements IBorrowService {
	@Autowired
	private BorrowRepository repository;

	@Override
	public Borrow create(Borrow borrow) {
		return repository.save(borrow);
	}

	@Override
	public Borrow findById(Long id) {
		Optional<Borrow> borrow = repository.findById(id);
		if (borrow.isEmpty())
			return null;

		return borrow.get();
	}

	@Override
	public void update(Borrow borrow) {
		repository.save(borrow);
	}

	@Override
	public void unBorrow(Borrow borrow) {
		borrow.setState(BorrowState.Returned);
		LocalDate now = LocalDate.now();
		borrow.setReturnedAt(now);
		borrow.setUpdatedAt(now);
		repository.save(borrow);
	}

	@Override
	public List<Borrow> findAllByStudentId(Long studentId) {
		return repository.findAllByStudentId(studentId);
	}

	@Override
	public List<Borrow> findAll() {
		return repository.findAll();
	}
}
