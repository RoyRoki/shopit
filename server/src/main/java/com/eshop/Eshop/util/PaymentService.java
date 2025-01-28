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

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount",amountInPaise.intValue());
            orderRequest.put("currency",currency);
            orderRequest.put("receipt", receipt);

            JSONObject jsonNotes = new JSONObject();
            notes.forEach(jsonNotes::put);
            orderRequest.put("notes",jsonNotes);

            Order order = razorpay.orders.create(orderRequest);
            return order.get("id");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    // Verify Razorpay payment callback
    public String verifyPaymentCallback(String rz_paymentId, String rz_orderId, String rz_signature) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);

            JSONObject paymentDetails = new JSONObject();
            paymentDetails.put("razorpay_payment_id", rz_paymentId);
            paymentDetails.put("razorpay_order_id", rz_orderId);
            paymentDetails.put("razorpay_signature", rz_signature);

            boolean status = Utils.verifyPaymentSignature(paymentDetails, RAZORPAY_KEY_SECRET);

            // Get the payment model by using the unique rz_orderId
            PaymentOrder paymentOrder = paymentOrderRepo.findByPaymentId(rz_orderId);

            if (paymentOrder == null) {
                throw new IllegalArgumentException("PaymentOrder not found for orderId: " + rz_orderId);
            }


            if(status) {
                // Update the payment status
                paymentOrder.setPayStatus(PayStatus.SUCCESS);

                // Update the order
                paymentServiceHelper.handleSuccessfulPayment(paymentOrder);
            }

            // Saved the updated paymentOrder
            paymentOrderRepo.save(paymentOrder);

            return status ? "Payment successful!" : "Payment Failed!";

        } catch (RazorpayException e) {
            throw new RuntimeException("Error verifying Razorpay payment"+e.getMessage());
        }
    }
}
