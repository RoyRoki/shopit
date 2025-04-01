package com.eshop.Eshop.model.dto.requestdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserAddressDTO {

    @NotBlank(message = "House number is required")
    @Size(max = 10, message = "House number must not exceed 10 characters")
    private String houseNo;

    @NotBlank(message = "Street is required")
    @Size(max = 50, message = "Street name must not exceed 50 characters")
    private String street;

    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City name must not exceed 50 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 50, message = "State name must not exceed 50 characters")
    private String state;

    @NotBlank(message = "Pin code is required")
    @Pattern(regexp = "\\d{6}", message = "Pin code must be exactly 6 digits")
    private String pinCode;

    @Size(max = 100, message = "Landmark must not exceed 100 characters")
    private String landmark;

    private boolean isDefault;
}
