package com.eshop.Eshop.controller;

import com.eshop.Eshop.util.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping(value = "/callback")
    public String paymentCallback(@RequestParam("razorpay_payment_id") String paymentId,
                                  @RequestParam("razorpay_order_id") String orderId,
                                  @RequestParam("razorpay_signature") String signature) {
        try {
            return paymentService.verifyPaymentCallback(paymentId, orderId, signature);

        } catch (Exception e) {
            e.printStackTrace();
            return "Payment verification failed!";
        }
    }
}
