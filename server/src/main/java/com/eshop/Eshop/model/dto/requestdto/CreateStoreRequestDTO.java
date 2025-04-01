package com.eshop.Eshop.model.dto.requestdto;

import com.eshop.Eshop.model.Address;
import com.eshop.Eshop.model.enums.ShippingType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.util.Set;

@Data
public class CreateStoreRequestDTO {
    private String name;
    private String description;
    private String email;
    private String mobileNo;
    private Set<Long> categoryIds;
    private String houseNo;
    private String street;
    private String city;
    private String state;
    private String pinCode;
    private String landmark;
}
