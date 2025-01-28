package com.eshop.Eshop.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@Builder
public class OrderAddress {
    private String houseNo;
    private String street;
    private String city;
    private String state;
    private String pinCode;
    private String landmark;
}
