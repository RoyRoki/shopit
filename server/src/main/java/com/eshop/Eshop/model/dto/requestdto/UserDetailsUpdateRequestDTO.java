package com.eshop.Eshop.model.dto.requestdto;

import com.eshop.Eshop.model.Address;
import lombok.Data;

@Data
public class UserDetailsUpdateRequestDTO {
    private String userName;
    private String email;
    private Address address;
}
