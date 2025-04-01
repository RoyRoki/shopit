package com.eshop.Eshop.model.dto.requestdto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtRefreshRequestDTO {

    @NotBlank(message = "RefreshToken cantnot be empty.")
    private String refreshToken;
}
