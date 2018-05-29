package com.eshop.Interfaces;

import com.eshop.entities.CartProduct;
import com.eshop.entities.Payment;
import com.eshop.exceptions.ProductCartEmptyException;

import java.util.List;


public interface PaymentMethod {

    void sendPayment(Payment payment) throws Exception;

    int calcAmountInCents(List<CartProduct> list) throws ProductCartEmptyException;
}
