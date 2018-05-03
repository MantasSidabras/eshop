package com.eshop.controllers;

import com.eshop.entities.User;
import com.eshop.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping(value = "/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @ResponseBody
    @GetMapping
    public List<User> getAllUsers(){
        return userService.findAll();
    }

    @ResponseBody
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<User> getUserById(@PathVariable("id") Integer id){
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.ok(user);
        }
    }

    @ResponseBody
    @PostMapping(consumes = "application/json", produces = "application/json")
    public User createUser(@RequestBody User user){
        user.setDateCreated(LocalDateTime.now());
        return userService.create(user);
    }

    @ResponseBody
    @PutMapping(consumes = "application/json", produces = "application/json")
    public User updateUser(@RequestBody User user){
        return userService.update(user);
    }
}
