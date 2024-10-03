package com.learn.library.dto.book;

import java.io.Serializable;

import org.springframework.web.multipart.MultipartFile;

public class CreateBookReq implements Serializable {
    public String title;
    public String author;
    public MultipartFile cover;
    public int quantity;
    public String location;
}