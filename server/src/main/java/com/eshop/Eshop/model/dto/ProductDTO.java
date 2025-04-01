package com.eshop.Eshop.model.dto;

import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.model.Keyword;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private Boolean isActive;
    private String name;
    private String description;
    private Double prices;
    private Double discount;
    private Integer stock;
    private List<String> imageUrls;
    private List<String> videoUrls;
    private TableDto tableDto;
    private Set<Keyword> keywords;
    private Set<Category> categories;

    private Double length;
    private Double width;
    private Double height;
    private Double weight;
    private String material;

    private String storeName;
    private Long storeId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
