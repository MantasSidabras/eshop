package com.eshop.services;

import com.eshop.Interfaces.PaymentMethod;
import com.eshop.entities.CartProduct;
import com.eshop.entities.Payment;
import com.eshop.exceptions.ProductCartEmptyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceMock2 implements PaymentMethod {


    public void sendPayment(Payment payment) throws Exception {
        System.out.println("ALTERNATIVE KEK 2");
    }


    public int calcAmountInCents(List<CartProduct> list) throws ProductCartEmptyException {
        System.out.println("LISTIMUS MAXIMUS 2");
        return 0;
    }
}