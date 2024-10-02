package com.learn.library.dto.book;

import java.io.Serializable;

public class UpdateBookReq implements Serializable {
    public Long id;
    public String title;
    public String author;
    public int quantity;
    public String location;
}