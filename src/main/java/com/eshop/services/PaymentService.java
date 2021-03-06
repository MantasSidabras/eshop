package com.eshop.services;

import com.eshop.Interfaces.PaymentMethod;
import com.eshop.entities.CartProduct;
import com.eshop.entities.Payment;

import com.eshop.entities.User;
import com.eshop.exceptions.PaymentException;
import com.eshop.exceptions.ProductCartEmptyException;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;

@Service
public class PaymentService implements PaymentMethod{

    private final String url = "https://mock-payment-processor.appspot.com/v1/payment";

    @Value("${payment.user}")
    private String userAuth;
    
    @Async
    public void sendPayment(Payment payment) throws Exception {
//        if(!isPaymentValid(payment)){
//            throw new PaymentException("Incorrect data");
//        }


        String encoding = Base64.getEncoder().encodeToString((userAuth).getBytes("UTF-8"));
        HttpPost request = new HttpPost(url);

        Header headers[] = {
            new BasicHeader("Content-Type", "application/json"),
            new BasicHeader("Authorization", "Basic " + encoding),
        };
        request.setHeaders(headers);

        String body = "{" +
                "\"amount\": " + payment.getAmount() + ", " +
                "\"number\": \"" + payment.getNumber() + "\", " +
                "\"holder\": \"" + payment.getHolder() + "\", " +
                "\"exp_year\": " + payment.getExpYear() + ", " +
                "\"exp_month\": " + payment.getExpMonth() + ", " +
                "\"cvv\": \"" + payment.getCvv() + "\" " +
                "}";

        StringEntity entity = new StringEntity(body, ContentType.APPLICATION_FORM_URLENCODED);

        HttpClient httpClient = HttpClientBuilder.create().build();
        request.setEntity(entity);
        HttpResponse response = httpClient.execute(request);

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        int statusCode = response.getStatusLine().getStatusCode();

        if (statusCode == 400) {
            throw new PaymentException("Incorrect data");
        }

        if (statusCode == 402) {
            throw new PaymentException("Card expired");
        }
    }

    public int calcAmountInCents(List<CartProduct> list) throws ProductCartEmptyException {
        if (list.size() == 0) {
            throw new ProductCartEmptyException();
        }

        BigDecimal amount = BigDecimal.ZERO;

        for (CartProduct cp: list) {
            amount = amount.add(cp.getProduct().getPrice().multiply(BigDecimal.valueOf(cp.getQuantity())));
        }

        amount = amount.multiply(BigDecimal.valueOf(100));

        return amount.intValueExact();
    }

    private boolean isPaymentValid(Payment payment) {
        if (payment.getAmount() > 0 &&
            payment.getNumber().length() == 16 &&
            payment.getHolder().length() >= 2 &&
            payment.getHolder().length() <= 32 &&
            payment.getExpYear() >= 1970 &&
            payment.getExpMonth() >= 1 &&
            payment.getExpMonth() <= 12 &&
            payment.getCvv().length() == 3
        ) {
            return true;
        } else {
            return false;
        }
    }

}