package com.eshop.Eshop.model.dto;

import java.time.LocalDateTime;

import com.eshop.Eshop.model.OrderAddress;
import com.eshop.Eshop.model.enums.OrderStatus;
import com.eshop.Eshop.model.enums.PaymentType;

import jakarta.persistence.Embedded;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderInfoDTO {

    private Long id;
    private Double grandPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    @Embedded
    private OrderAddress orderAddress;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
