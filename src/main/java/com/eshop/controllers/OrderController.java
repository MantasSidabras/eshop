package com.eshop.controllers;

import com.eshop.entities.Order;
import com.eshop.entities.User;
import com.eshop.exceptions.ProductCartEmptyException;
import com.eshop.services.CommerceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("api/order")
@CrossOrigin("http://localhost:3000")
public class OrderController {


    @Autowired
    private CommerceService commerceService;

    @PostMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Order> createOrder(@RequestBody User user, @RequestBody String address){
        try{
            return ResponseEntity.ok(commerceService.createOrderForUser(user));
        }catch (ProductCartEmptyException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
