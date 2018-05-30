package com.eshop.controllers;

import com.eshop.Interfaces.PaymentMethod;
import com.eshop.entities.Order;
import com.eshop.entities.Payment;
import com.eshop.entities.User;
import com.eshop.exceptions.*;
import com.eshop.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("api/order")
@CrossOrigin("http://localhost:3000")
public class OrderController {

    @Autowired
    PaymentMethod paymentService;

    @Autowired
    CommerceService commerceService;

    @Autowired
    AuthService authService;

    @GetMapping
    @ResponseBody
    public List<Order> getAll() {
        return this.commerceService.getAllOrders();
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<Map<String, String>> create(@RequestHeader("Authorization") String authHeader, @RequestBody Payment payment) {
        Map<String, String> res = new HashMap<>();
        Order newOrder = new Order();
        try {

            User user = authService.getUserFromHeader(authHeader);
            commerceService.checkIntegrity(user);

            for(Order order : user.getOrderList()){
                if(order.getState() == OrderState.Unpaid) {
                    res.put("message", "Payment failed");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
                }
            }

            newOrder = commerceService.createOrder(user, payment);

            payment.setAmount(paymentService.calcAmountInCents(user.getCartProductList()));
            paymentService.sendPayment(payment);

            newOrder.setState(OrderState.Paid);
            commerceService.removeAllFromCartByUserId(user.getId());
            Order savedOrder = commerceService.updateOrder(newOrder);

            res.put("message", "Payment successful");
            res.put("orderId", savedOrder.getId().toString());
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
            commerceService.deleteOrderById(newOrder.getId());
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

    @PostMapping("/{id}/rating")
    @ResponseBody
    public ResponseEntity<Order> updateOrder(@RequestHeader("Authorization") String authHead, @PathVariable("id") Integer id, @RequestBody Integer rating){

        try{
            User tokenUser = authService.getUserFromHeader(authHead);
            Order existing = commerceService.findOrderById(id);
            authService.authorizeResource(tokenUser, existing.getUser().getId());

            Order updated = commerceService.setOrderRating(id, rating);

            if (updated == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            } else {
                return ResponseEntity.ok(updated);
            }
        }
        catch(UnauthorizedException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        catch (Exception e ) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

    }

}
