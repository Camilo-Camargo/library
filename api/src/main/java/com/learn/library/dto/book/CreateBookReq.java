package com.learn.library.dto.book;

import java.io.Serializable;

public class CreateBookReq implements Serializable {
    public String title;
    public String author;
    public int quantity;
    public String location;
}