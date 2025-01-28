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

    @Column(nullable = false)
    private String paymentId;

    @Column(nullable = false)
    private Long orderId;

    private LocalDateTime createdAt;


    @Enumerated(EnumType.STRING)
    private PayStatus payStatus;

}
