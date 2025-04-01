package com.eshop.Eshop.model.dto.requestdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequestOtpVerificationDTO {

    @NotBlank(message = "Mobile number cannot be empty")
    @Pattern(regexp = "\\d{10}", message = "Invalid mobile number. Must be exactly 10 digits")
    private String mobileNo;

    @NotBlank(message = "OTP cannot be empty")
    @Size(min = 4, max = 6, message = "OTP must be between 4 to 6 digits")
    @Pattern(regexp = "\\d{4,6}", message = "OTP must contain only numbers")
    private String otp;
}
