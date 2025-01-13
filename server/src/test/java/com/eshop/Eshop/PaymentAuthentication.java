package com.eshop.Eshop;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class PaymentAuthentication {

    @Value("${payment.com.RAZORPAY_KEY_ID}")
    private String RAZORPAY_KEY_ID;

    @Value("${payment.com.RAZORPAY_KEY_SECRET}")
    private String RAZORPAY_KEY_SECRET;

    @Test
    public void testRazorpayAuthentication() {
        try {
            RazorpayClient razorpay = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
            System.out.println("Authentication Successful");
        } catch (RazorpayException e) {
            e.printStackTrace();
            System.out.println("Authentication Failed: " + e.getMessage());
        }
    }

}
