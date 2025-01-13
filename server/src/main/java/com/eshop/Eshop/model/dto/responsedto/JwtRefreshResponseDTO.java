package com.eshop.Eshop.model.dto.responsedto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtRefreshResponseDTO {
    private String jwt;
    private String refreshToken;
}
