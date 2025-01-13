package com.eshop.Eshop.util;

import com.eshop.Eshop.model.PaymentOrder;
import com.eshop.Eshop.model.enums.PayStatus;
import com.eshop.Eshop.repository.PaymentOrderRepo;
import com.eshop.Eshop.service.OrderServiceImp;
import com.eshop.Eshop.service.helper.PaymentServiceHelper;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import com.razorpay.*;

@Service
public class PaymentService {

    @Value("${payment.com.RAZORPAY_KEY_ID}")
    private String RAZORPAY_KEY_ID;

    @Value("${payment.com.RAZORPAY_KEY_SECRET}")
    private String RAZORPAY_KEY_SECRET;

    @Autowired
    private PaymentOrderRepo paymentOrderRepo;

    @Autowired
    private PaymentServiceHelper paymentServiceHelper;

    // successful order creating it return orderId
    public String createOrder(Double amountInPaise, String currency, String receipt, Map<String, String> notes) throws RazorpayException {

        try {
            RazorpayClient razorpay = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
            System.out.println(RAZORPAY_KEY_SECRET+"  "+RAZORPAY_KEY_ID);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount",amountInPaise.intValue());
            orderRequest.put("currency",currency);
            orderRequest.put("receipt", receipt);

            JSONObject jsonNotes = new JSONObject();
            notes.forEach(jsonNotes::put);
            orderRequest.put("notes",jsonNotes);

//            Order order = razorpay.orders.create(orderRequest);
//            return order.get("id");
                Random random = new Random();
            return String.valueOf("*rpay#"+random.nextLong(1000,9999));

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

    }

    // Verify Razorpay payment callback
    public String verifyPaymentCallback(String paymentId, String orderId, String signature) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);

            JSONObject paymentDetails = new JSONObject();
            paymentDetails.put("razorpay_payment_id", paymentId);
            paymentDetails.put("razorpay_order_id", orderId);
            paymentDetails.put("razorpay_signature", signature);

//            boolean status = Utils.verifyPaymentSignature(paymentDetails, RAZORPAY_KEY_SECRET);
            boolean status = true;
            PaymentOrder paymentOrder = paymentOrderRepo.findByOrderId(orderId);
            if (paymentOrder == null) {
                throw new IllegalArgumentException("PaymentOrder not found for orderId: " + orderId);
            }
            paymentOrder.setPaymentId(paymentId);
            paymentOrder.setPayStatus(PayStatus.SUCCESS);
            // Saved the updated paymentOrder
            paymentOrderRepo.save(paymentOrder);

            if(status) {
                // update the order
                paymentServiceHelper.handleSuccessfulPayment(paymentOrder);
            }

            return status ? "Payment successful!" : "Payment Failed!";

        } catch (RazorpayException e) {
            throw new RuntimeException("Error verifying Razorpay payment"+e.getMessage());
        }
    }
}
