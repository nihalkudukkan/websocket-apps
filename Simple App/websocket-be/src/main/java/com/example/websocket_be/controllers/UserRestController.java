package com.example.websocket_be.controllers;

import com.example.websocket_be.model.ErrorResponse;
import com.example.websocket_be.model.User;
import com.example.websocket_be.service.UserServices;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserRestController {

    private UserServices userServices;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userServices.findAllUsers();
    }

    @PostMapping("/user")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        try {
            return new ResponseEntity<>(userServices.addUser(user), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> findUser(@PathVariable String username) {
        try {
            User user = userServices.findByUsername(username);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
}
