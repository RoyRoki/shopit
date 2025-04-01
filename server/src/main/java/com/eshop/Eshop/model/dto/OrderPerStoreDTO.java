package com.eshop.Eshop.model.dto;

import com.eshop.Eshop.model.dto.responsedto.OrderItemDTO;
import com.eshop.Eshop.model.enums.PaymentType;
import com.eshop.Eshop.model.enums.ShippingType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
    public class OrderPerStoreDTO {
    private Long storeId;
    private String storeName;

    @Enumerated(EnumType.STRING)
    private ShippingType shippingType;

    @Enumerated(EnumType.STRING)
    private Set<PaymentType> paymentTypes;

    private List<OrderItemDTO> orderItems;

    private double storeSubtotal;
    private double gstAmount;
    private double deliveryCost;
    private double Total;
}
