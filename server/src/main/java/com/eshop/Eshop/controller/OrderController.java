package com.eshop.Eshop.controller;

import com.eshop.Eshop.model.Order;
import com.eshop.Eshop.model.dto.responsedto.PaymentIdDetails;
import com.eshop.Eshop.service.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/order")
public class OrderController {

    @Autowired
    private OrderServiceImp orderService;

    // place order for all cart items
    @PostMapping(value = "/place")
    public ResponseEntity<?> placeOrder() {
        try {
            Order order = orderService.placeOrder();
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Failed To process order: " +e.getMessage());
        }
    }

    // User request to payment
    @GetMapping(value = "/{orderId}/payment-request")
    public ResponseEntity<?> getPaymentOrderId(@PathVariable Long orderId) {
        try {
            PaymentIdDetails paymentIdDetails = orderService.getPaymentOrderId(orderId);
            System.out.println(orderId);
            return ResponseEntity.ok(paymentIdDetails);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to generate orderId for payment\n"+e.getMessage());
        }
    }
}
