package com.learn.library.dto.book;

import java.io.Serializable;

import org.springframework.web.multipart.MultipartFile;

public class UpdateBookReq implements Serializable {
    public Long id;
    public String title;
    public String author;
    public MultipartFile cover;
    public int quantity;
    public String location;
}