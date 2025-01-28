package com.eshop.Eshop.model.dto.responsedto;

import com.eshop.Eshop.model.dto.CartItemDTO;
import com.eshop.Eshop.model.enums.PaymentType;
import com.eshop.Eshop.model.enums.ShippingType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@Builder
public class OrderSummaryPerStoreDTO {
    private Long storeId;
    private String storeName;

    @Enumerated(EnumType.STRING)
    private ShippingType shippingType;

    @Enumerated(EnumType.STRING)
    private Set<PaymentType> paymentTypes;

    private List<CartItemDTO> cartItems;

    private double storeSubtotal;
    private double gstAmount;
    private double deliveryCost;
    private double Total;
}
