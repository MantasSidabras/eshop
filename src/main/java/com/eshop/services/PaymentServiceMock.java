package com.eshop.services;

import com.eshop.Interfaces.PaymentMethod;
import com.eshop.entities.CartProduct;
import com.eshop.entities.Payment;
import com.eshop.exceptions.ProductCartEmptyException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class PaymentServiceMock implements PaymentMethod{


    public void sendPayment(Payment payment) throws Exception {
        System.out.println("ALTERNATIVE KEK");
    }


    public int calcAmountInCents(List<CartProduct> list) throws ProductCartEmptyException {
        System.out.println("LISTIMUS MAXIMUS");
        return 0;
    }
}
