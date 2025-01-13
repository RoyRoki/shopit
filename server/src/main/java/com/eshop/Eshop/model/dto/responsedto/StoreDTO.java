package com.eshop.Eshop.model.dto.responsedto;

import com.eshop.Eshop.model.Category;
import com.eshop.Eshop.model.enums.ShippingType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
public class StoreDTO {

    private Long id;
    private String name;
    private String email;
    private String mobileNo;
    private String description;
    private Boolean isActive;

    @Enumerated(EnumType.STRING)
    private ShippingType shippingType;

    private String houseNo;
    private String street;
    private String city;
    private String state;
    private String pinCode;
    private String landmark;

    private String logoUrl;
    private String header;
    private String about;

    private Set<Category> categories;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
