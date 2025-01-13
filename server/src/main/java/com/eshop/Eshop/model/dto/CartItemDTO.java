package com.eshop.Eshop.model.dto;

import com.eshop.Eshop.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private ProductDTO product;
    private Integer quantity;
    private Boolean isAvailable;
}
