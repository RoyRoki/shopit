package com.eshop.Eshop.model.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ViewCartDTO {
    private Long id;
    private List<CartItemDTO> cartItems;
    private Double totalCartPrice;
}
