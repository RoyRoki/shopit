package com.eshop.Eshop.service;

import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.responsedto.PaymentIdDetails;
import com.eshop.Eshop.model.enums.OrderStatus;
import com.eshop.Eshop.model.enums.PayStatus;
import com.eshop.Eshop.model.enums.PaymentType;
import com.eshop.Eshop.repository.*;
import com.eshop.Eshop.service.Interface.OrderService;
import com.eshop.Eshop.service.helper.UpdateServiceHelper;
import com.eshop.Eshop.util.PaymentService;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImp implements OrderService {

    @Autowired
    private DTOService dtoService;

    @Autowired
    private UserServiceImp userService;

    @Autowired
    private CartServiceImp cartService;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentOrderRepo paymentOrderRepo;

    @Autowired
    private StoreServiceImp storeService;

    @Autowired
    private UpdateServiceHelper updateServiceHelper;

    @Value("${payment.com.RAZORPAY_KEY_ID}")
    private String RAZORPAY_KEY_ID;


    @Override
    public Order placeOrder(Long addressId, PaymentType paymentType) {
        try {
            User user = userService.currentUser();

            // Check if the given address ID is present in the user's address list
            Address address = user.getAddresses().stream()
                    .filter(ad -> ad.getId().equals(addressId))
                    .findFirst()
                    .orElseGet(() ->
                        // If the address ID is not found, use the default address
                            user.getAddresses().stream()
                                    .filter(ad -> ad.getId().equals(user.getDefaultAddressId()))
                                    .findFirst()
                                    .orElse(null)   // If no default address is found, return null
                    );

            if(address == null) {
                throw new IllegalArgumentException("No valid address found for the given ID or default address.");
            }
            // Check the payment type
            if(paymentType == null) {
                paymentType = PaymentType.ONLINE;
            }

            Cart cart = user.getCart();
            List<OrderPerStore> orderPerStores = cartService.getOrderPerStore(cart, user);
            Double grandPrice = calGrandPrice(orderPerStores);

            Order order = Order.builder()
                    .user(user)
                    .orderPerStores(orderPerStores)
                    .grandPrice(grandPrice)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .orderAddress(dtoService.userAddressToOrderAddress(address))
                    .paymentType(paymentType)
                    .build();

            // If Payment Type is CaseOnDelivery then confirm the order
            if(paymentType.equals(PaymentType.COD)) {
                order.setOrderStatus(OrderStatus.CONFIRMED);
            }

            // Else if payment type is online then
            if(paymentType.equals(PaymentType.ONLINE)) {
                order.setOrderStatus(OrderStatus.PENDING);
            }

            // Set the order in each orderSummaryPerStores
            for(OrderPerStore orderPerStore : orderPerStores) {
                orderPerStore.setOrder(order);
                // Link each OrderItem to the OrderPerStore
                for(OrderItem orderItem : orderPerStore.getOrderItems()) {
                    orderItem.setOrderPerStore(orderPerStore);
                }
            }

            // Save the order and orderPerStores
            orderRepo.save(order);

            // If Payment Type is CaseOnDelivery And order successfully saved than
            if(paymentType.equals(PaymentType.COD)) {
                // Notify user and store
                userService.handleConfirmedOrder(order);
                storeService.handleConfirmedOrder(order);
            }

            return order;

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

    }

    @Override
    public PaymentIdDetails getPaymentOrderId(Long orderId) {
        try {
            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Failed to fetch order for orderId "+orderId));

            // Check it the order has payment type ONLINE
            if(!order.getPaymentType().equals(PaymentType.ONLINE)) {
                throw new IllegalArgumentException("This Order don't support online payment!");
            }
            Map<String, String> notes = Map.of(
                    "order_id", order.getId().toString(),
                    "user_id", String.valueOf(order.getUser().getId())
            );

            String payOrderId = paymentService.createOrder(order.getGrandPrice() * 100,
                            "INR", "Receipt#"+order.getCreatedAt().toString(),
                            notes);

            PaymentOrder paymentOrder = PaymentOrder.builder()
                    .orderId(orderId) // User's Order Id use to track the order
                    .paymentId(payOrderId) // Payment Id use to verify the payment
                    .payStatus(PayStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            paymentOrderRepo.save(paymentOrder);
            return
                    PaymentIdDetails.builder()
                            .paymentOrderId(payOrderId)
                            .name(order.getUser().getUserName())
                            .apiKeyId(RAZORPAY_KEY_ID)
                            .amountInPaise(String.valueOf(order.getGrandPrice()*100))
                            .currency("INR")
                            .build();

        } catch (RazorpayException e) {
            throw new RuntimeException("Error during create payment order In orderServiceImp-getPaymentOrderId "+e.getMessage());
        }
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId, String message) {
        try {
            // Delete the order
            orderRepo.deleteByIdAndOrderStatus(orderId, OrderStatus.PENDING);

            System.out.printf("Order Id %d deleted for reason : %s", orderId, message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }


    private Double calGrandPrice(List<OrderPerStore> orderPerStores) {
        return orderPerStores.stream()
                .mapToDouble(OrderPerStore::getTotal)
                .sum();
    }

    @Override
    public void handleShipped(Long orderId, Store store) {
        try {
            Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Error During fetching order;"));
            order.setOrderStatus(OrderStatus.SHIPPED);
            order.setUpdatedAt(LocalDateTime.now());

            orderRepo.save(order);

            // Send Message to use and store
            updateServiceHelper.handleShippedOrder(order, store);
        } catch(Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
