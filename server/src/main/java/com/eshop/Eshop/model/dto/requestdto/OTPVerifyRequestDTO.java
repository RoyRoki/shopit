package com.eshop.Eshop.model.dto.requestdto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OTPVerifyRequestDTO {
    @Pattern(regexp = "\\d{10}", message = "Invalied mobile number")
    private String mobileNo;

    @Email(message = "Invalied email address")
    private String email;

    @NotBlank(message = "OTP cannot be empty")
    @Size(min = 4, max = 6, message = "OTP must be between 4 to 6 digits")
    @Pattern(regexp = "\\d{4,6}", message = "OTP must contain only numbers")
    private String otp;

    @AssertTrue(message = "Either mobileNo or email must be provided")
    public boolean isValid() {
        return (mobileNo != null && !mobileNo.trim().isEmpty()) || 
               (email != null && !email.trim().isEmpty());
    }
}
