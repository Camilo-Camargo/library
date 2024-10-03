package com.learn.library.controller;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.learn.library.dto.borrow.BorrowRes;
import com.learn.library.dto.student.StudentRes;
import com.learn.library.dto.student.DeleteStudentReq;
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

    @GetMapping(value = "api/student")
    public ResponseEntity<List<StudentRes>> findAll() {
        return ResponseEntity.status(HttpStatus.FOUND).body(StudentRes.fromEntities(service.findAll()));
    }

    @GetMapping(value = "api/student/{id}/borrow")
    public ResponseEntity<List<BorrowRes>> findBorrows(@PathVariable Long id) {
        Student student = service.findByUserId(id);
        List<Borrow> borrows = service.findAllBorrowsById(student.getId());
        if (borrows == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.status(HttpStatus.FOUND).body(BorrowRes.fromEntities(borrows));
    }

    @GetMapping("api/student/{id}")
    public ResponseEntity<StudentRes> getById(@PathVariable Long id) {
        Student student = service.findByUserId(id);
        User user = userService.findById(id);
        student.setUser(user);
        if (student == null || user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.FOUND).body(StudentRes.fromEntity(student));
    }

    @RequestMapping(value = "/api/student", method = RequestMethod.PUT, consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<StudentRes> update(
            @RequestParam("id") Long id,
            @RequestParam("fullname") String fullname,
            @RequestParam("identification") String identification,
            @RequestParam("password") String password,
            @RequestParam("grade") int grade,
            @RequestParam(value = "profileImage", required = false) MultipartFile image) {

        Student studentFound = service.findByUserId(id);
        if (studentFound == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        User user = studentFound.getUser();
        String imagePath = studentFound.getUser().getProfileImage();

        if (image != null) {
            String originalFilename = image.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String timestamp = String.valueOf(Instant.now().toEpochMilli());

            imagePath = "books/" + timestamp + extension;

            try {
                imagePath = "/" + fileService.saveFile(image, imagePath);
            } catch (IOException e) {
                System.err.println("File upload failed: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        user.setIdentification(identification);
        user.setFullname(fullname);
        user.setPassword(password);
        user.setProfileImage(imagePath);
        userService.create(user);

        studentFound.setGrade(grade);
        service.update(studentFound);
        return ResponseEntity.status(HttpStatus.CREATED).body(StudentRes.fromEntity(studentFound));
    }
    

    @DeleteMapping("api/student")
    public ResponseEntity<StudentRes> delete(
            @RequestBody DeleteStudentReq req) {
        Student student = service.findByUserId(req.id);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        service.delete(student);
        userService.delete(student.getUser());
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

        String originalFilename = image.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String timestamp = String.valueOf(Instant.now().toEpochMilli());

        String imagePath = "books/" + timestamp + extension;

        try {
            imagePath = "/" + fileService.saveFile(image, imagePath);
        } catch (IOException e) {
            System.err.println("File upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
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
}
