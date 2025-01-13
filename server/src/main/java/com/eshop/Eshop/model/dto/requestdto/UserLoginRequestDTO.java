package com.eshop.Eshop.model.dto.requestdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginRequestDTO {
    private String password;
    private String mobileNo;
    private String email;
}
