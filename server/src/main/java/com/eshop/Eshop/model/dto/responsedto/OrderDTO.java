package com.eshop.Eshop.model.dto.responsedto;

import com.eshop.Eshop.model.dto.OrderPerStoreDTO;
import com.eshop.Eshop.model.enums.OrderStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private List<OrderPerStoreDTO> orderPerStores;
    private Double grandPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
