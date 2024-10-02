package com.learn.library.dto.borrow;

import java.io.Serializable;
import java.time.LocalDate;

public class UpdateBorrowReq implements Serializable {
    public Long id;
    public int quantity;
    public LocalDate returnDate;
}