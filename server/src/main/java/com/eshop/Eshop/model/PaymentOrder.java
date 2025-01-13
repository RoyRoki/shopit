package com.eshop.Eshop.model;

import com.eshop.Eshop.model.enums.PayStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_order_id")
    private Order order;

    @Column(nullable = false)
    private String orderId;

    @Enumerated(EnumType.STRING)
    private PayStatus payStatus;

    private String paymentId;
}
