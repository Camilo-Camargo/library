package com.learn.library.dto.borrow;

import java.io.Serializable;

public class CreateBorrowReq implements Serializable {
    public Long studentId;
    public Long bookId;
    public int quantity;
}