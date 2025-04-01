package com.eshop.Eshop.model.dto.requestdto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SignupRequestOtpDTO {

    @Pattern(regexp = "\\d{10}", message = "Invalied mobile number")
    private String mobileNo;

    @Email(message = "Invalied email address")
    private String email;

    @AssertTrue(message = "Either mobileNo or email must be provided")
    public boolean isValid() {
        return (mobileNo != null && !mobileNo.trim().isEmpty()) || 
               (email != null && !email.trim().isEmpty());
    }
}
