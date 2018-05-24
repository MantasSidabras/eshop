package com.eshop.controllers;

import com.eshop.entities.Order;
import com.eshop.entities.Payment;
import com.eshop.entities.User;
import com.eshop.exceptions.*;
import com.eshop.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

@Controller
@RequestMapping("api/order")
@CrossOrigin("http://localhost:3000")
public class OrderController {

    @Autowired
    PaymentService paymentService;

    @Autowired
    CommerceService commerceService;

    @Autowired
    AuthService authService;

    @GetMapping
    @ResponseBody
    public List<Order> getAll() {
        return this.commerceService.getAllOrders();
    }

    @Async
    @PostMapping
    @ResponseBody
    public ResponseEntity<Map<String, String>> create(@RequestHeader("Authorization") String authHeader, @RequestBody Payment payment) {
        Map<String, String> res = new HashMap<>();
        try {
            User user = authService.getUserFromHeader(authHeader);

            commerceService.checkIntegrity(user);

            payment.setAmount(paymentService.calcAmountInCents(user.getCartProductList()));
            paymentService.sendPayment(payment);
            commerceService.createOrder(user, payment);

            res.put("message", "Payment successful");
            return ResponseEntity.status(HttpStatus.CREATED).body(res);

        } catch(UnauthorizedException e) {
            e.printStackTrace();
            res.put("message", "Unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
        } catch(InvalidProductQuantityException e) {
            e.printStackTrace();
            res.put("message", "Not enough items, please update your cart");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
        } catch(PaymentException e) {
            e.printStackTrace();
            res.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(res);
        } catch(Exception e) {
            e.printStackTrace();
            res.put("message", "Payment failed");
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(res);
        }
    }

    @PutMapping
    @ResponseBody
    public ResponseEntity<Order> updateOrder(@RequestHeader("Authorization") String authHead, @RequestBody Order order){

        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            authService.authorizeAdmin(tokenUser);

            Order updated = commerceService.updateOrder(order);

            if (updated == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            } else {
                return ResponseEntity.ok(updated);
            }
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

    }
}
