package com.eshop.controllers;

import com.eshop.entities.CartProduct;
import com.eshop.entities.Order;
import com.eshop.entities.User;
import com.eshop.exceptions.*;
import com.eshop.services.AuthService;
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
    private AuthService authService;

    @Autowired
    private CommerceService commerceService;

    @PostMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<User> createUser(@RequestBody User user){
        try {
            user.setDateCreated(LocalDateTime.now());
            return ResponseEntity.ok(userService.create(user));
        } catch(UserNotCreatedException ex){
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(null);
        }
    }

    @GetMapping
    @ResponseBody
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String authHead){
        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeAdmin(tokenUser);

            return ResponseEntity.ok(userService.findAll());
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
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
    public ResponseEntity<User> updateUser(@RequestHeader("Authorization") String authHeader, @RequestBody User user){
        try {
            User tokenUser = authService.getUserFromHeader(authHeader);
            User updatedUser = userService.update(tokenUser, user);
            return ResponseEntity.ok(updatedUser);
        }
        catch(UnauthorizedException | IllegalAccessException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        catch(UserNotFoundException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{id}/cartProduct")
    @ResponseBody
    public List<CartProduct> getCartByUserId(@PathVariable("id") Integer id){
        return commerceService.getCartProductsByUserId(id);
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
