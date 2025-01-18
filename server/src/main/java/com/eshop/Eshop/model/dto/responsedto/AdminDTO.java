package com.eshop.Eshop.model.dto.responsedto;

import com.eshop.Eshop.model.Address;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminDTO {
    private Long id;
    private String userName;
    private String email;
    private String mobileNo;
    private String profileUrl;
    private List<Address> addresses;
}
