package com.eshop.Eshop.model.dto.requestdto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginRequestDTO {

    @NotBlank(message = "Password is required")
    private String password;

    @Pattern(regexp = "^\\d{10}$", message = "Mobile number must be exactly 10 digits")
    private String mobileNo;

    @Email(message = "Invalid email format")
    private String email;

    @AssertTrue(message = "Either email or mobile number must be provided")
    public boolean isValidLogin() {
        return (mobileNo != null && !mobileNo.isBlank()) || (email != null && !email.isBlank());
    }
}
