package com.learn.library.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.learn.library.dto.UserRes;
import com.learn.library.services.UserService;

@RestController
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping("api/users")
    public ResponseEntity<List<UserRes>> findAll() {
        return ResponseEntity.status(HttpStatus.FOUND).body(UserRes.fromEntities(service.findAll()));
    }
}
