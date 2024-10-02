package com.learn.library.interfaces;

import java.util.List;

import com.learn.library.model.Book;

public interface IBookService {
	public Book create(Book book);

	public void update(Book book);

	public void delete(Book book);

	public Book findById(Long id);

	public List<Book> findAvailables();
}
