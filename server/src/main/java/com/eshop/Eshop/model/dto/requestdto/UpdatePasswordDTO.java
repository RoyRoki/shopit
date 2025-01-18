package com.eshop.Eshop.model.dto.requestdto;

import lombok.Data;

@Data
public class UpdatePasswordDTO {
    private String oldPassword;
    private String newPassword;
}
