package com.eshop.Eshop.model.dto.requestdto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddProductRequestDTO {
    private String name;
    private String description;
    private Double prices;
    private Integer stock;
    private Set<Long> categoryIds;
    private Set<String> keywords;
}
