package com.eshop.controllers;

import com.eshop.entities.Order;
import com.eshop.entities.User;
import com.eshop.exceptions.ProductCartEmptyException;
import com.eshop.exceptions.UserNotFoundException;
import com.eshop.services.CommerceService;
import com.eshop.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("api/user")
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private CommerceService commerceService;

    @PostMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@RequestBody User user){
        user.setDateCreated(LocalDateTime.now());
        return userService.create(user);
    }

    @GetMapping
    @ResponseBody
    public List<User> getAllUsers(){
        return userService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<User> getUserById(@PathVariable("id") Integer id){
        try{
            return ResponseEntity.ok(userService.findById(id));
        }catch(UserNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping
    @ResponseBody
    public User updateUser(@RequestBody User user){
        return userService.update(user);
    }

    @DeleteMapping("/{id}/cartProduct")
    @ResponseBody
    public Map<String, String> deleteAllCartProducts(@PathVariable Integer id) {
        Map<String, String> res = new HashMap<>();
        this.commerceService.removeAllFromCartByUserId(id);
        res.put("message", "success");
        return res;
    }

}
