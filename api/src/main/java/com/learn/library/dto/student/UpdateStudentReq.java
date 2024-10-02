package com.learn.library.dto.student;

import java.io.Serializable;

public class UpdateStudentReq implements Serializable {
    public Long id;
    public String fullname;
    public int grade;
}