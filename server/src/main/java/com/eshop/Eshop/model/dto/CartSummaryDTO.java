package com.eshop.Eshop.model.dto;

import com.eshop.Eshop.model.dto.responsedto.OrderSummaryPerStoreDTO;
import com.eshop.Eshop.model.enums.PaymentType;
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
public class CartSummaryDTO {
      private Long cartId;
      private List<OrderSummaryPerStoreDTO> orderSummaryPerStores;
      private double cartSubtotal;
      private double totalGstAmount;
      private double totalDeliveryCost;
      private double grandTotal;
}
