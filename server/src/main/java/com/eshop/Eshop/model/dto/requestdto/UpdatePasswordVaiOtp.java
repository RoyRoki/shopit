package com.eshop.Eshop.model.dto.requestdto;

import lombok.Data;

@Data
public class UpdatePasswordVaiOtp {
    private String email;
    private String mobile;
    private String otp;
    private String newPassword;
}
