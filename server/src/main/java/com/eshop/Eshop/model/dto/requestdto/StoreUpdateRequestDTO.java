package com.eshop.Eshop.model.dto.requestdto;

import com.eshop.Eshop.model.enums.PaymentType;
import com.eshop.Eshop.model.enums.ShippingType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.util.Set;

@Data
public class StoreUpdateRequestDTO {
    private String name;
    private String email;
    private String mobileNo;
    private String description;
    private Boolean isActive;


    private String houseNo;
    private String street;
    private String city;
    private String state;
    private String pinCode;
    private String landmark;

    private String logoUrl;
    private String header;
    private String about;
    private Set<Long> categoryIds;

    @Enumerated(EnumType.STRING)
    private ShippingType shippingType;

    @Enumerated(EnumType.STRING)
    private Set<PaymentType> paymentTypes;
}
