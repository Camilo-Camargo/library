package com.learn.library.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.learn.library.dto.UserLoginReq;
import com.learn.library.dto.borrow.BorrowRes;
import com.learn.library.dto.student.StudentRes;
import com.learn.library.dto.student.DeleteStudentReq;
import com.learn.library.dto.student.UpdateStudentReq;
import com.learn.library.model.Borrow;
import com.learn.library.model.Student;
import com.learn.library.model.User;
import com.learn.library.services.FileService;
import com.learn.library.services.StudentService;
import com.learn.library.services.UserService;

@RestController
public class StudentController {
    @Autowired
    private StudentService service;

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    @GetMapping(value = "api/student/{id}/borrow")
    public ResponseEntity<List<BorrowRes>> findBorrows(@PathVariable Long id) {
        List<Borrow> borrows = service.findAllBorrowsById(id);
        if (borrows == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.status(HttpStatus.FOUND).body(BorrowRes.fromEntities(borrows));
    }

    @GetMapping("api/student/{id}")
    public ResponseEntity<StudentRes> getById(@PathVariable Long id) {
        Student student = service.findById(id);
        User user = userService.findById(id);
        student.setUser(user);
        if (student == null || user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.FOUND).body(StudentRes.fromEntity(student));
    }

    @PutMapping("api/student")
    public ResponseEntity<StudentRes> update(
            @RequestBody UpdateStudentReq req) {
        User userFound = userService.findById(req.id);
        Student student = service.findById(req.id);
        if (userFound == null || student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User user = new User();
        user.setId(req.id);
        user.setFullname(req.fullname);

        userFound.setFullname(req.fullname);
        service.update(student);
        userService.update(user);
        student.setUser(userFound);
        return ResponseEntity.status(HttpStatus.OK).body(StudentRes.fromEntity(student));
    }

    @DeleteMapping("api/student")
    public ResponseEntity<StudentRes> delete(
            @RequestBody DeleteStudentReq req) {
        User userFound = userService.findById(req.id);
        Student student = service.findById(req.id);
        if (userFound == null || student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        student.setUser(userFound);
        userService.delete(userFound);
        service.delete(student);
        return ResponseEntity.status(HttpStatus.OK).body(StudentRes.fromEntity(student));
    }

    @RequestMapping(value = "/api/register", method = RequestMethod.POST, consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<StudentRes> create(
            @RequestParam("fullname") String fullname,
            @RequestParam("identification") String identification,
            @RequestParam("password") String password,
            @RequestParam("grade") int grade,
            @RequestParam("profileImage") MultipartFile image) {

        String imagePath = image.getOriginalFilename();
        try {
            imagePath = "/" + fileService.saveFile(image, identification + "/" + imagePath);
        } catch (IOException e) {
            System.out.println(e);
        }

        String username = userService.generateUsername(fullname, identification);

        User user = new User(identification, fullname, username, password, "student", imagePath);
        userService.create(user);

        Student student = new Student();
        student.setId(user.getId());
        student.setGrade(grade);
        student.setUser(user);
        service.create(student);

        return ResponseEntity.status(HttpStatus.CREATED).body(StudentRes.fromEntity(student));
    }

    @PostMapping
    @RequestMapping(value = "api/login", consumes = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<StudentRes> login(
            @RequestBody UserLoginReq req) {
        User user = userService.login(req.username, req.password);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Student student = service.findById(user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(StudentRes.fromEntity(student));
    }
}
