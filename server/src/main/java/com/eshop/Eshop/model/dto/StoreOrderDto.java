package com.eshop.Eshop.model.dto;

import java.util.List;

import com.eshop.Eshop.model.dto.responsedto.OrderItemDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StoreOrderDto {

      private List<OrderItemDTO> orderItems;
      private Double storeSubtotal;
      private Double gstAmount;
      private Double deliveryCost;
      private Double total;

      private OrderInfoDTO orderInfo;

      private CustomerDTO customer;
}
