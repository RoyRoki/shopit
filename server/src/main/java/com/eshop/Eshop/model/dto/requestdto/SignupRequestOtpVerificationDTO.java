package com.eshop.Eshop.model.dto.requestdto;

import lombok.Data;

@Data
public class SignupRequestOtpVerificationDTO {
    private String mobileNo;
    private String otp;
}
