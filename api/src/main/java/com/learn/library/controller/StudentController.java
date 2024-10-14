package com.learn.library.controller;

import java.io.IOException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;

import java.io.InputStreamReader;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
import com.learn.library.model.UserIdentificationType;
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
            @RequestParam("identificationType") UserIdentificationType identificationType,
            @RequestParam("code") String code,
            @RequestParam("grade") int grade,
            @RequestParam("age") int age,
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
        user.setIdentificationType(identificationType);
        user.setFullname(fullname);
        user.setProfileImage(imagePath);
        user.setAge(age);
        userService.create(user);

        studentFound.setGrade(grade);
        studentFound.setCode(code);
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
            @RequestParam("identificationType") UserIdentificationType identificationType,
            @RequestParam("code") String code,
            @RequestParam("grade") int grade,
            @RequestParam("age") int age,
            @RequestParam(value = "profileImage", required = false) MultipartFile image) {

        String imagePath = "";
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

        String username = userService.generateUsername(fullname, identification);

        User user = new User(identification, identificationType, fullname, username, null, "student", age,imagePath);
        userService.create(user);

        Student student = new Student();
        student.setId(user.getId());
        student.setGrade(grade);
        student.setCode(code);
        student.setUser(user);
        service.create(student);

        return ResponseEntity.status(HttpStatus.CREATED).body(StudentRes.fromEntity(student));
    }

    @PostMapping(value = "api/student/from-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> fromFiles(@RequestParam("files") MultipartFile[] files) {
        if (files.length == 0) {
            return ResponseEntity.badRequest().build();
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
                String[] header = reader.readNext();
                List<String[]> rows = reader.readAll();

                for (String[] row : rows) {
                    if (row.length < 6) {
                        continue;
                    }

                    String fullname = row[0].trim();
                    String[] identificationAttrs = row[1].trim().replace(".", "").split(" ");

                    if (identificationAttrs.length < 2) {
                        continue;
                    }

                    String identificationTypeStr = identificationAttrs[0].trim();
                    String identification = identificationAttrs[1].trim();
                    UserIdentificationType identificationType;

                    switch (identificationTypeStr) {
                        case "TI":
                            identificationType = UserIdentificationType.TI;
                            break;
                        case "CC":
                            identificationType = UserIdentificationType.CC;
                            break;
                        case "PPT":
                            identificationType = UserIdentificationType.PPT;
                            break;
                        case "NES":
                            identificationType = UserIdentificationType.NES;
                            break;
                        case "NAN":
                            identificationType = UserIdentificationType.NAN;
                            break;
                        default:
                            continue;
                    }

                    String code = row[4].trim();
                    int grade;
                    int age;

                    try {
                        grade = Integer.parseInt(row[5].trim());
                        age = Integer.parseInt(row[2].trim());
                    } catch (NumberFormatException e) {
                        continue;
                    }

                    Student existingStudent = service.findByCode(code);
                    User user;

                    if (existingStudent != null) {
                        user = existingStudent.getUser();
                        user.setFullname(fullname);
                        user.setIdentification(identification);
                        user.setIdentificationType(identificationType);
                        user.setAge(age);
                        userService.update(user);

                        existingStudent.setGrade(grade);
                        service.update(existingStudent);
                    } else {
                        String username = userService.generateUsername(fullname, identification);
                        user = new User(identification, identificationType, fullname, username, null, "student", age,null);
                        user.setAge(age);
                        userService.create(user);

                        Student newStudent = new Student();
                        newStudent.setId(user.getId());
                        newStudent.setGrade(grade);
                        newStudent.setCode(code);
                        newStudent.setUser(user);
                        service.create(newStudent);
                    }
                }
            } catch (IOException | CsvException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
