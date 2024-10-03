package com.learn.library.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learn.library.dto.UserLoginReq;
import com.learn.library.dto.UserRes;
import com.learn.library.model.User;
import com.learn.library.services.UserService;

@RestController
public class UserController {
    @Autowired
    private UserService service;


    @PostMapping
    @RequestMapping(value = "api/login", consumes = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<UserRes> login(
            @RequestBody UserLoginReq req) {
        User user = service.login(req.username, req.password);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(UserRes.fromEntity(user));
    }

    @PostMapping("api/create-admin")
    public ResponseEntity<UserRes> createAdmin() {
        User user = service.create(new User("0", "admin", "admin", "admin", "admin", "admin"));
        return ResponseEntity.status(HttpStatus.FOUND).body(UserRes.fromEntity(user));
    }

    @GetMapping("api/users")
    public ResponseEntity<List<UserRes>> findAll() {
        return ResponseEntity.status(HttpStatus.FOUND).body(UserRes.fromEntities(service.findAll()));
    }
}
