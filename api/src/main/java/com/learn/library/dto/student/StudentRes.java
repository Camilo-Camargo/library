package com.learn.library.dto.student;

import java.util.ArrayList;
import java.util.List;

import com.learn.library.model.Student;
import com.learn.library.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentRes {
    private Long id;
    private String username;
    private String identification;
    private String fullname;
    private String role;
    private String profileImage;
    private int grade;

    public static StudentRes fromEntity(Student student) {
        User user = student.getUser();
        return new StudentRes(
                user.getId(),
                user.getUsername(),
                user.getIdentification(),
                user.getFullname(),
                user.getRole(),
                user.getProfileImage(),
                student.getGrade());
    }

    public static List<StudentRes> fromEntities(List<Student> students) {
        List<StudentRes> studentsRes = new ArrayList<>();
        for (Student student : students) {
            studentsRes.add(fromEntity(student));
        }
        return studentsRes;
    }
}