package com.eshop.Eshop.model.dto.requestdto;

import lombok.Data;

@Data
public class OTPVerifyRequestDTO {
    private String email;
    private String mobileNo;
    private String otp;
}
