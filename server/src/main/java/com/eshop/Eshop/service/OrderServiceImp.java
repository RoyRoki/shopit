package com.eshop.Eshop.service;

import com.eshop.Eshop.model.*;
import com.eshop.Eshop.model.dto.responsedto.PaymentIdDetails;
import com.eshop.Eshop.model.enums.OrderStatus;
import com.eshop.Eshop.model.enums.PayStatus;
import com.eshop.Eshop.repository.*;
import com.eshop.Eshop.service.Interface.OrderService;
import com.eshop.Eshop.service.helper.CategoryServiceHelper;
import com.eshop.Eshop.service.helper.KeywordServiceHelper;
import com.eshop.Eshop.util.AuthenticationContextService;
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
    private StoreRepo storeRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private AuthenticationContextService authenticationContextService;

    @Autowired
    private DTOService dtoService;

    @Autowired
    private CategoryServiceHelper categoryHelper;

    @Autowired
    private KeywordServiceHelper keywordHelper;

    @Autowired
    private UserServiceImp userService;

    @Autowired
    private CartServiceImp cartService;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderPerStoreRepo orderPerStoreRepo;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentOrderRepo paymentOrderRepo;

    @Autowired
    private StoreServiceImp storeService;

    @Value("${payment.com.RAZORPAY_KEY_ID}")
    private String RAZORPAY_KEY_ID;


    @Override
    public Order placeOrder() {
        try {
            User user = userService.currentUser();

            Cart cart = user.getCart();
            List<OrderPerStore> orderPerStores = cartService.getOrderPerStore(cart, user);
            double grandPrice = calGrandPrice(orderPerStores);

            Order order = Order.builder()
                    .user(user)
                    .orderPerStores(orderPerStores)
                    .grandPrice(grandPrice)
                    .orderStatus(OrderStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Set the order in each orderPerStore
            for(OrderPerStore orderPerStore : orderPerStores) {
                orderPerStore.setOrder(order);
                // Link each OrderItem to the OrderPerStore
                for(OrderItem orderItem : orderPerStore.getOrderItems()) {
                    orderItem.setOrderPerStore(orderPerStore);
                }
            }

            // Save the order and orderPerStores
            orderRepo.save(order);

            return order;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }

    }

    @Override
    public PaymentIdDetails getPaymentOrderId(Long orderId) {
        try {
            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Failed to fetch order for orderId "+orderId));
            Map<String, String> notes = Map.of(
                    "order_id", order.getId().toString(),
                    "user_id", String.valueOf(order.getUser().getId())
            );

            String payOrderId = paymentService.createOrder(order.getGrandPrice(),
                            "INR", "Receipt#"+order.getCreatedAt().toString(),
                            notes);

            PaymentOrder paymentOrder = PaymentOrder.builder()
                    .orderId(payOrderId)
                    .order(order)
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


    private double calGrandPrice(List<OrderPerStore> orderPerStores) {
        return orderPerStores.stream()
                .mapToDouble(OrderPerStore::getTotal)
                .sum();
    }
}
