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
    public ResponseEntity<User> getUserById(@RequestHeader("Authorization") String authHead, @PathVariable("id") Integer id){
        try{
            User tokenUser = authService.getUserFromHeader(authHead);

            // Check if trying to get self
            authService.authorizeResource(tokenUser, id);
            return ResponseEntity.ok(userService.findById(id));

        }catch(UserNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        catch (UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
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
    public ResponseEntity<List<CartProduct>> getCartByUserId(@RequestHeader("Authorization") String authHead, @PathVariable("id") Integer id){

        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeResource(tokenUser, id);

            //User trying to retrieve self cart
            return ResponseEntity.ok(commerceService.getCartProductsByUserId(id));
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @DeleteMapping("/{id}/cartProduct")
    @ResponseBody
    public ResponseEntity<Map<String, String>> deleteAllCartProducts(@RequestHeader("Authorization") String authHead, @PathVariable Integer id) {

        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeResource(tokenUser, id);

            Map<String, String> res = new HashMap<>();
            this.commerceService.removeAllFromCartByUserId(id);

            //Returning map to parse as json
            res.put("message", "success");
            return ResponseEntity.ok(res);
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/{id}/cart")
    @ResponseBody
    public ResponseEntity<Map<String, String>> checkCartIntegrity(@RequestHeader("Authorization") String authHead, @PathVariable("id") Integer id){
        Map<String, String> res = new HashMap<>();
        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeResource(tokenUser, id);

            commerceService.checkIntegrity(tokenUser);


            res.put("message", "success");
            return ResponseEntity.ok(res);
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (InvalidProductQuantityException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
}
