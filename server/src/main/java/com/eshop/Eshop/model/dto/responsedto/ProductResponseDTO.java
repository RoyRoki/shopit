package com.eshop.Eshop.model.dto.responsedto;

import com.eshop.Eshop.model.dto.TableDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    private Long productId;
    private String productName;
    private String description;
    private Double prices;
    private Double discount;
    private Integer stock;
    private Set<String> keywords;
    private Set<Long> categoryIds;
    private List<String> imageUrls;
    private List<String> videoUrls;
    private String storeName;
    private Long storeId;
    private TableDto tableDto;
    private Boolean isActive;

    private Double length;
    private Double width;
    private Double height;
    private Double weight;
    private String material;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
