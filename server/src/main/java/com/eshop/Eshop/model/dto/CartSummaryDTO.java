package com.eshop.Eshop.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartSummaryDTO {
      private Long cartId;
      List<OrderPerStoreDTO> orderPerStore;
      private double cartSubtotal;
      private double totalGstAmount;
      private double totalDeliveryCost;
      private double grandTotal;
}
