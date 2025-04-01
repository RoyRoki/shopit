package com.eshop.Eshop.model.dto.responsedto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSignUpResponseDTO {
    private String userId;
    private String userName;
    private String email;
    private String mobileNo;
}
