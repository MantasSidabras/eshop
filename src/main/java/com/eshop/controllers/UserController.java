package com.eshop.controllers;

import com.eshop.controllers.requestors.UserCreateRequest;
import com.eshop.entities.Order;
import com.eshop.entities.User;
import com.eshop.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value = "/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @ResponseBody
    @GetMapping
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @ResponseBody
    @PostMapping(consumes = "application/json", produces = "application/json")
    public User createUser(@RequestBody UserCreateRequest ucr){
        return userService.createUser(ucr.getEmail(), ucr.getPassword());
    }
}
