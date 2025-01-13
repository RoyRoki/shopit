package com.eshop.Eshop.model.dto.requestdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSignUpRequestDTO {
    private String userName;
    private String mobileNo;
    private String email;
    private String password;
}
