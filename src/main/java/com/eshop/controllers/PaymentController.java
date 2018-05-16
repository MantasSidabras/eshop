package com.eshop.controllers;

import com.eshop.entities.Payment;
import com.eshop.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


@Controller
@RequestMapping("api/pay")
@CrossOrigin("http://localhost:3000")
public class PaymentController {
    @Autowired
    PaymentService paymentService;

    @PostMapping
    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    public String pay(@RequestBody Payment payment) {
        try {
            return paymentService.sendPayment(payment);
        } catch (Exception ex){
            return "Error while sending payment.";
        }
    }
}