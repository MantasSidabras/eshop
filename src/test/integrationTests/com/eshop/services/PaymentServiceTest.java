package com.eshop.services;

import com.eshop.entities.Payment;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;


import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(SpringExtension.class)
@SpringBootTest
class PaymentServiceTest {
    PaymentService paymentService;

    @Test
    void sendPayment() {

        paymentService = new PaymentService();
        Payment payment = new Payment();
        payment.setAmount(1000);
        payment.setNumber("4111111111111111");
        payment.setHolder("Benas Orlovas");
        payment.setExpYear(2020);
        payment.setExpMonth(11);
        payment.setCvv("147");

        //paymentService.sendPayment(payment);
//        payment = {}
    }
}