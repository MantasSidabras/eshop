package com.eshop.services;

import com.eshop.entities.Payment;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicHeader;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class PaymentService {

    private final String url = "https://mock-payment-processor.appspot.com/v1/payment";
    private final String userAuth = "technologines:platformos";

    private final String successfulPayment = "Payment successful";
    private final String inccorectData = "Payment failed, inccorect data";
    private final String unauthorizedUser = "Payment failed, user unauthorized";
    private final String failedPayment = "Payment failed";
    private final String operationNotFound = "Operation not found";


    public String sendPayment(Payment payment){
        try {
            String encoding = Base64.getEncoder().encodeToString((userAuth).getBytes("UTF-8"));
            HttpPost request = new HttpPost(url);
            request.setHeader("Authorization", "Basic " + encoding);

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

            StringEntity entity = new StringEntity(body,
                    ContentType.APPLICATION_FORM_URLENCODED);

            HttpClient httpClient = HttpClientBuilder.create().build();
            request.setEntity(entity);
            HttpResponse response = httpClient.execute(request);
            if(response.getStatusLine().getStatusCode() ==  201){
                return successfulPayment;
            }
            if(response.getStatusLine().getStatusCode() == 400) {
                return inccorectData;
            }
            if(response.getStatusLine().getStatusCode() == 401) {
                return unauthorizedUser;
            }
            if(response.getStatusLine().getStatusCode() == 402) {
                return failedPayment;
            }
            if(response.getStatusLine().getStatusCode() == 404) {
                return operationNotFound;
            }
        }catch (Exception ex) {
            return failedPayment;
        }
        return failedPayment;
    }


}