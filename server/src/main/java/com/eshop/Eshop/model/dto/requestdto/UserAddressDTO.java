package com.eshop.Eshop.model.dto.requestdto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserAddressDTO {
    private String houseNo;
    private String street;
    private String city;
    private String state;
    private String pinCode;
    private String landmark;
    private boolean isDefault;
}
