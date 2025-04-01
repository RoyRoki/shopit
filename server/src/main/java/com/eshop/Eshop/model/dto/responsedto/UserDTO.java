package com.eshop.Eshop.model.dto.responsedto;

import com.eshop.Eshop.model.Address;
import com.eshop.Eshop.model.Cart;
import com.eshop.Eshop.model.Role;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String userName;
    private String email;
    private String mobileNo;
    private String profileUrl;
    private List<Address> addresses;
    private Long defaultAddressId;
    private List<Role> roles;
}
