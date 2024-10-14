package com.learn.library.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.learn.library.interfaces.IBookService;
import com.learn.library.model.Book;
import com.learn.library.repositories.BookRepository;

@Service
public class BookService implements IBookService {
	@Autowired
	private BookRepository repository;

	@Override
	public Book create(Book book) {
		return repository.save(book);
	}

	@Override
	public Book findById(Long id) {
		Optional<Book> book = repository.findById(id);
		if (book.isEmpty())
			return null;

		return book.get();
	}

	@Override
	public void update(Book book) {
		repository.save(book);
	}

	@Override
	public void delete(Book book) {
		repository.delete(book);
	}

	@Override
	public List<Book> findAll(){
		return repository.findAll();
	}

	@Override
	public List<Book> findAvailables() {
		return repository.findAvailables();
	}
}
