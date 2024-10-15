package com.learn.library.dto;

import java.io.Serializable;
import java.time.LocalDate;

public class CreateBorrowReq implements Serializable {
	public Long studentId;
	public Long bookId;
	public int quantity;
	public LocalDate returnDate;
	public String observations;
}
