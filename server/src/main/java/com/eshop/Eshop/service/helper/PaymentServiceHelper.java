package com.eshop.Eshop.service.helper;

import com.eshop.Eshop.model.Order;
import com.eshop.Eshop.model.OrderItem;
import com.eshop.Eshop.model.OrderPerStore;
import com.eshop.Eshop.model.PaymentOrder;
import com.eshop.Eshop.model.enums.OrderStatus;
import com.eshop.Eshop.model.enums.PayStatus;
import com.eshop.Eshop.repository.OrderRepo;
import com.eshop.Eshop.service.StoreServiceImp;
import com.eshop.Eshop.service.UserServiceImp;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentServiceHelper {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private UserServiceImp userService;

    @Autowired
    private StoreServiceImp storeService;

    @Transactional
    public void handleSuccessfulPayment(PaymentOrder paymentOrder) {
        Long orderId = paymentOrder.getOrderId();
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Failed while change the status during successful payment!"));

        // Update order status
        order.setOrderStatus(OrderStatus.CONFIRMED);
        order.getOrderPerStores().forEach(orderPerStore -> orderPerStore.setOrderStatus(OrderStatus.CONFIRMED));
        orderRepo.save(order);

        // Notify user and store
        userService.handleConfirmedOrder(order);
        storeService.handleConfirmedOrder(order);
    }
}
