package com.eshop.Eshop.model.dto.responsedto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class StoreResponseDto {
    private Long id;
    private String name;
    private String email;
    private String description;
    private String state;
    private String city;
    private String logoUrl;
    private String bannerUrl;
    private String header;
    private String about;
    private Set<Long> categoryIds;
    private LocalDateTime createdAt;
}
