package com.eshop.Eshop.model.dto.requestdto;

import com.eshop.Eshop.model.dto.TableDto;
import lombok.Data;

import java.util.Set;

@Data
public class ProductEditRequestDTO {
    private String name;
    private String description;
    private Double prices;
    private Double discount;
    private Integer stock;
    private TableDto table;
    private Set<Long> categoryIds;
    private Set<String> keywords;
    private Boolean isActive;
    // In cm & g
    private Double length;
    private Double width;
    private Double height;
    private Double weight;
    private String material;
}
