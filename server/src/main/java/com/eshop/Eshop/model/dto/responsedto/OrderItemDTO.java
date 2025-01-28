package com.eshop.Eshop.model.dto.responsedto;

import com.eshop.Eshop.model.dto.ProductDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemDTO {
    private Long id;
    private ProductDTO product;
    private Integer quantity;
    private Double finalPrice; // with discount
}
