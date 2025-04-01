package com.eshop.Eshop.controller;

import com.eshop.Eshop.util.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping(value = "/callback")
    public String paymentCallback(@RequestParam("razorpay_payment_id") String rz_paymentId,
                                  @RequestParam("razorpay_order_id") String rz_orderId,
                                  @RequestParam("razorpay_signature") String rz_signature) {
        try {
            return paymentService.verifyPaymentCallback(rz_paymentId, rz_orderId, rz_signature);
        } catch (Exception e) {
            e.printStackTrace();
            return "Payment verification failed!";
        }
    }
}
