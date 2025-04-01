package com.eshop.Eshop.model.dto.requestdto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDetailsUpdateRequestDTO {

    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String userName;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^\\d{10}$", message = "Mobile number must be exactly 10 digits")
    private String mobileNo;
}
